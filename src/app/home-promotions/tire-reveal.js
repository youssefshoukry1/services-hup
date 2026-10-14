// Keep ALEX's reveal timing; spin the tire according to its rolling distance.
const REVEAL_START = .78;
const REVEAL_SPAN = .62;
const SMOOTHING_MS = 120;

export function tireFrame(progress, travel = 0, diameter = 1) {
  const p = Math.min(1, Math.max(0, progress));
  const t = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return {
    t,
    rotation: Math.max(0, travel) * t / (Math.PI * Math.max(1, diameter)) * 360,
    offset: Math.max(0, travel) * (t - 1),
  };
}

export function mountTireReveal(section, headline, win = window) {
  // The heading stays readable until the first position is ready.
  if (!win.IntersectionObserver) return () => {};
  const reducedMotion = win.matchMedia("(prefers-reduced-motion: reduce)");
  const touchDevice = win.matchMedia("(pointer: coarse)");
  let frame = 0;
  let running = false;
  let disposed = false;
  let ready = false;
  let geometryPending = true;
  let travel = 0;
  let diameter = 1;
  let viewportWidth = win.innerWidth;
  let viewportHeight = win.innerHeight || 1;
  let progress = 0;
  let targetProgress = 0;
  let startingProgress = 0;
  let motionStartedAt = null;
  let inputPending = false;
  let snapPending = false;
  const previousValues = {};

  const refreshViewport = () => {
    // Mobile address-bar/keyboard height changes must not advance the reveal.
    if (!touchDevice.matches || viewportWidth !== win.innerWidth) {
      viewportHeight = win.innerHeight || 1;
    }
    viewportWidth = win.innerWidth;
  };

  const write = (progress, stationary = false) => {
    const values = tireFrame(progress, stationary ? 0 : travel, diameter);
    Object.entries(values).forEach(([name, value]) => {
      const rounded = value.toFixed(4);
      if (previousValues[name] !== rounded) {
        headline.style.setProperty(`--tire-${name}`, rounded);
        previousValues[name] = rounded;
      }
    });
    if (!ready) {
      headline.setAttribute("data-tire-ready", "true");
      ready = true;
    }
  };

  const measureProgress = () => {
    if (disposed || reducedMotion.matches) return null;
    if (geometryPending) {
      const tire = headline.querySelector("[data-tire]");
      const track = headline.querySelector("[data-tire-track]");
      const tireWidth = tire?.offsetWidth || 0;
      const trackWidth = track?.offsetWidth || 0;
      if (!trackWidth || !tireWidth) return null;
      travel = Math.max(0, trackWidth - tireWidth);
      diameter = tireWidth * .96;
      geometryPending = false;
    }
    return Math.min(1, Math.max(0, (viewportHeight * REVEAL_START - section.getBoundingClientRect().top) / (viewportHeight * REVEAL_SPAN)));
  };

  const render = () => {
    const measured = measureProgress();
    if (measured === null) return;
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    inputPending = snapPending = false;
    motionStartedAt = null;
    progress = targetProgress = startingProgress = measured;
    write(progress);
  };

  const tick = (time) => {
    frame = 0;
    if (!running || disposed || reducedMotion.matches) return;
    if (motionStartedAt !== null) {
      const elapsed = Math.min(1, Math.max(0, (time - motionStartedAt) / SMOOTHING_MS));
      const ease = 1 - Math.pow(1 - elapsed, 3);
      progress = startingProgress + (targetProgress - startingProgress) * ease;
      if (elapsed === 1) {
        progress = targetProgress;
        motionStartedAt = null;
      }
    }
    if (inputPending) {
      const measured = measureProgress();
      inputPending = false;
      if (measured !== null) {
        if (snapPending) {
          progress = targetProgress = startingProgress = measured;
          motionStartedAt = null;
        } else if (measured !== targetProgress) {
          startingProgress = progress;
          targetProgress = measured;
          motionStartedAt = time;
        }
      }
      snapPending = false;
    }
    // Position, rotation and text reveal share one eased progress value.
    write(progress);
    if (motionStartedAt !== null) frame = win.requestAnimationFrame(tick);
  };

  const onScroll = () => {
    if (!running || disposed) return;
    inputPending = true;
    // Retarget from the displayed position; catch-up ends within 120ms.
    if (!frame) frame = win.requestAnimationFrame(tick);
  };

  const onResize = () => {
    // Browser chrome changes height during a phone swipe; keep easing uninterrupted.
    if (touchDevice.matches && viewportWidth === win.innerWidth) return;
    geometryPending = true;
    snapPending = true;
    refreshViewport();
    onScroll();
  };

  const start = () => {
    if (running || disposed || reducedMotion.matches) return;
    running = true;
    geometryPending = true;
    refreshViewport();
    // Re-entry and restored scroll positions use current geometry immediately.
    render();
    headline.setAttribute("data-tire-active", "true");
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onResize, { passive: true });
  };

  const stop = () => {
    running = false;
    win.removeEventListener("scroll", onScroll);
    win.removeEventListener("resize", onResize);
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    motionStartedAt = null;
    inputPending = snapPending = false;
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
      write(1, true);
    } else {
      geometryPending = true;
      refreshViewport();
      render();
      observer.observe(headline);
    }
  };

  const resizeObserver = win.ResizeObserver ? new win.ResizeObserver(() => {
    geometryPending = true;
    snapPending = true;
    onScroll();
  }) : null;
  resizeObserver?.observe(headline);

  const onPageShow = () => {
    if (disposed) return;
    geometryPending = true;
    refreshViewport();
    render();
  };

  sync();
  reducedMotion.addEventListener("change", sync);
  win.addEventListener("pageshow", onPageShow, { passive: true });
  win.document?.fonts?.ready?.then(() => {
    if (disposed) return;
    geometryPending = true;
    snapPending = true;
    if (running) onScroll();
  });
  return () => {
    disposed = true;
    observer.disconnect();
    resizeObserver?.disconnect();
    reducedMotion.removeEventListener("change", sync);
    win.removeEventListener("pageshow", onPageShow);
    stop();
    headline.removeAttribute("data-tire-ready");
    ["t", "rotation", "offset"].forEach((name) => headline.style.removeProperty(`--tire-${name}`));
  };
}
