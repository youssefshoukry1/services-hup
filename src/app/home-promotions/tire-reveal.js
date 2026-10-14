// Keep ALEX's reveal timing; spin the tire according to its rolling distance.
const REVEAL_START = .78;
const REVEAL_SPAN = .62;
const DAMPING = .085;
const EPSILON = .0004;

export function tireFrame(progress, travel = 0, diameter = 1) {
  const p = Math.min(1, Math.max(0, progress));
  const t = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return {
    t,
    rotation: Math.max(0, travel) * t / (Math.PI * Math.max(1, diameter)) * 360,
  };
}

export function mountTireReveal(section, headline, win = window) {
  // CSS supplies the complete heading when JS or observation is unavailable.
  if (!win.IntersectionObserver) return () => {};
  const reducedMotion = win.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let running = false;
  let disposed = false;
  let current = -1;
  let target = 0;
  let measurePending = true;
  let geometryPending = true;
  let travel = 0;
  let diameter = 1;
  let lastTime;

  const write = (progress, stationary = false) => {
    const values = tireFrame(progress, stationary ? 0 : travel, diameter);
    Object.entries(values).forEach(([name, value]) => {
      headline.style.setProperty(`--tire-${name}`, value.toFixed(4));
    });
  };

  const tick = (time) => {
    frame = 0;
    if (!running || disposed) return;
    // Read layout once per scroll/resize, not on every smoothing frame.
    if (measurePending) {
      if (geometryPending) {
        travel = headline.querySelector("[data-tire-track]").offsetWidth;
        // The cutout has a small transparent margin around its circular tread.
        diameter = headline.querySelector("[data-tire]").offsetWidth * .96;
        geometryPending = false;
      }
      const vh = win.innerHeight || 1;
      target = Math.min(1, Math.max(0, (vh * REVEAL_START - section.getBoundingClientRect().top) / (vh * REVEAL_SPAN)));
      measurePending = false;
    }
    const elapsed = lastTime === undefined ? 1000 / 60 : Math.min(64, Math.max(0, time - lastTime));
    lastTime = time;
    if (current < 0) current = target;
    else current += (target - current) * (1 - Math.pow(1 - DAMPING, elapsed / (1000 / 60)));
    if (Math.abs(target - current) < EPSILON) current = target;
    else frame = win.requestAnimationFrame(tick);
    write(current);
  };

  const onScroll = () => {
    measurePending = true;
    if (!frame) {
      lastTime = undefined;
      frame = win.requestAnimationFrame(tick);
    }
  };

  const onResize = () => {
    geometryPending = true;
    onScroll();
  };

  const start = () => {
    if (running || disposed || reducedMotion.matches) return;
    running = true;
    measurePending = true;
    geometryPending = true;
    lastTime = undefined;
    headline.setAttribute("data-tire-active", "true");
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onResize, { passive: true });
    frame = win.requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    win.removeEventListener("scroll", onScroll);
    win.removeEventListener("resize", onResize);
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = undefined;
    headline.removeAttribute("data-tire-active");
  };

  const observer = new win.IntersectionObserver(([entry]) => {
    if (disposed) return;
    if (entry.isIntersecting && !reducedMotion.matches) start();
    else stop();
  }, { rootMargin: "160px 0px" });

  const sync = () => {
    observer.disconnect();
    stop();
    if (reducedMotion.matches) {
      current = 1;
      write(1, true);
    } else observer.observe(section);
  };

  sync();
  reducedMotion.addEventListener("change", sync);
  return () => {
    disposed = true;
    observer.disconnect();
    reducedMotion.removeEventListener("change", sync);
    stop();
    ["t", "rotation"].forEach((name) => headline.style.removeProperty(`--tire-${name}`));
  };
}
