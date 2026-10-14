import assert from "node:assert/strict";
import test from "node:test";
import { mountTireReveal, tireFrame } from "../src/app/home-promotions/tire-reveal.js";

function setup({ reduced = false, coarse = false, initialTop = 780 } = {}) {
  let top = initialTop, nextFrame = 0, time = 0, reads = 0, geometryReads = 0, writes = 0, observerCallback, resizeCallback, observations = 0;
  let trackWidth = 704, tireWidth = 128;
  const frames = new Map(), listeners = new Map(), properties = new Map(), attributes = new Map();
  const preference = {
    matches: reduced,
    addEventListener(type, callback) { this.callback = callback; },
    removeEventListener(type, callback) { assert.equal(callback, this.callback); this.callback = undefined; },
  };
  const win = {
    innerHeight: 1000, innerWidth: 1000,
    matchMedia(query) {
      if (query === "(pointer: coarse)") return { matches: coarse };
      assert.equal(query, "(prefers-reduced-motion: reduce)"); return preference;
    },
    IntersectionObserver: class {
      constructor(callback) { observerCallback = callback; }
      observe() { observations++; }
      disconnect() {}
    },
    ResizeObserver: class {
      constructor(callback) { resizeCallback = callback; }
      observe() {}
      disconnect() {}
    },
    addEventListener(type, callback, options) { assert.equal(options.passive, true); listeners.set(type, callback); },
    removeEventListener(type, callback) { if (listeners.get(type) === callback) listeners.delete(type); },
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  const section = { getBoundingClientRect() { reads++; return { top }; } };
  const headline = {
    querySelector(selector) {
      return { get offsetWidth() { geometryReads++; return selector === "[data-tire-track]" ? trackWidth : tireWidth; } };
    },
    style: { setProperty: (key, value) => { writes++; properties.set(key, value); }, removeProperty: (key) => properties.delete(key) },
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: (key) => attributes.delete(key),
  };
  const dispose = mountTireReveal(section, headline, win);
  return {
    frames, listeners, properties, attributes, preference, dispose,
    get reads() { return reads; },
    get geometryReads() { return geometryReads; },
    get writes() { return writes; },
    get observations() { return observations; },
    value(name) { return Number(properties.get(`--tire-${name}`)); },
    intersect(isIntersecting) { observerCallback([{ isIntersecting }]); },
    scrollTo(nextTop) { top = nextTop; listeners.get("scroll")?.(); },
    jumpTo(nextTop) { top = nextTop; },
    resize(nextTrackWidth, nextTireWidth) { trackWidth = nextTrackWidth; tireWidth = nextTireWidth; listeners.get("resize")?.(); },
    layoutResize(nextTrackWidth, nextTireWidth) { trackWidth = nextTrackWidth; tireWidth = nextTireWidth; resizeCallback(); },
    viewportResize(width, height) { win.innerWidth = width; win.innerHeight = height; listeners.get("resize")?.(); },
    pageShow() { listeners.get("pageshow")?.(); },
    reduce(matches) { preference.matches = matches; preference.callback?.(); },
    step(milliseconds = 1000 / 60) {
      const callbacks = [...frames.values()];
      frames.clear();
      time += milliseconds;
      callbacks.forEach((callback) => callback(time));
    },
    flush() {
      let count = 0;
      while (frames.size) {
        assert.ok(count++ < 400, "Animation never settled");
        const callbacks = [...frames.values()];
        frames.clear();
        time += 1000 / 60;
        callbacks.forEach((callback) => callback(time));
      }
      return count;
    },
  };
}

test("the tire makes one revolution per circumference traveled", () => {
  const circumference = Math.PI * 100;
  assert.deepEqual(tireFrame(0, circumference, 100), { t: 0, rotation: 0, offset: -circumference });
  assert.deepEqual(tireFrame(.5, circumference, 100), { t: .5, rotation: 180, offset: -circumference / 2 });
  assert.deepEqual(tireFrame(1, circumference, 100), { t: 1, rotation: 360, offset: 0 });
  assert.deepEqual(tireFrame(1, 2 * circumference, 100), { t: 1, rotation: 720, offset: 0 });
});

test("scroll motion settles promptly and reverses without reading layout on easing frames", () => {
  const effect = setup();
  assert.equal(effect.listeners.has("scroll"), false);
  effect.intersect(true);
  effect.flush();
  assert.equal(effect.value("t"), 0);
  effect.scrollTo(160);
  assert.ok(effect.flush() <= 10);
  assert.equal(effect.value("t"), 1);
  const finalRotation = effect.value("rotation");
  assert.ok(finalRotation > 360);
  assert.equal(effect.reads, 3);
  assert.equal(effect.geometryReads, 4);
  assert.equal(effect.frames.size, 0);
  effect.scrollTo(470);
  effect.flush();
  assert.equal(effect.value("t"), .5);
  assert.ok(Math.abs(effect.value("rotation") - finalRotation / 2) < .0001);
  effect.scrollTo(780);
  effect.flush();
  assert.equal(effect.value("t"), 0);
  assert.equal(effect.value("rotation"), 0);
  assert.equal(effect.geometryReads, 4);
  effect.dispose();
});

test("a wheel step moves through intermediate positions and settles within a short easing window", () => {
  const effect = setup();
  effect.intersect(true);
  effect.scrollTo(160);
  effect.step();
  effect.step();
  const first = effect.value("t");
  assert.ok(first > 0 && first < 1);
  effect.step();
  assert.ok(effect.value("t") > first && effect.value("t") < 1);
  assert.equal(effect.reads, 3);
  assert.equal(effect.geometryReads, 4);
  assert.ok(effect.flush() <= 7);
  assert.equal(effect.value("t"), 1);
  assert.equal(effect.frames.size, 0);
  effect.dispose();
});

test("reversing a moving tire retargets from its displayed position without a jump", () => {
  const effect = setup();
  effect.intersect(true);
  effect.scrollTo(160);
  effect.step();
  effect.step(45);
  const displayed = effect.value("t");
  effect.scrollTo(780);
  // Same timestamp: processing the new target cannot jump the displayed tire.
  effect.step(0);
  assert.equal(effect.value("t"), displayed);
  effect.step();
  assert.ok(effect.value("t") < displayed);
  effect.flush();
  assert.equal(effect.value("t"), 0);
  assert.equal(effect.value("rotation"), 0);
  effect.dispose();
});

test("easing is consistent at different refresh rates", () => {
  const atRate = (rate) => {
    const effect = setup();
    effect.intersect(true);
    effect.scrollTo(160);
    effect.step(0);
    for (let frame = 0; frame < rate / 10; frame++) effect.step(1000 / rate);
    const position = effect.value("t");
    effect.dispose();
    return position;
  };
  assert.ok(Math.abs(atRate(60) - atRate(120)) < .0001);
});

test("phone browser-bar resizing does not snap an easing tire to its target", () => {
  const effect = setup({ coarse: true });
  effect.intersect(true);
  effect.scrollTo(160);
  effect.step();
  effect.step();
  const displayed = effect.value("t");
  effect.viewportResize(1000, 800);
  effect.step(0);
  assert.equal(effect.value("t"), displayed);
  effect.flush();
  assert.equal(effect.value("t"), 1);
  effect.dispose();
});

test("scroll events share one frame and leaving the section cancels all work", () => {
  const effect = setup();
  effect.intersect(true);
  effect.flush();
  for (let i = 0; i < 100; i++) effect.scrollTo(160);
  assert.equal(effect.frames.size, 1);
  effect.intersect(false);
  assert.equal(effect.frames.size, 0);
  assert.equal(effect.listeners.has("scroll"), false);
  assert.equal(effect.listeners.has("resize"), false);
  assert.equal(effect.attributes.has("data-tire-active"), false);
  assert.equal(effect.reads, 2);
  effect.dispose();
  effect.intersect(true);
  assert.equal(effect.frames.size, 0);
});

test("reduced motion displays the complete heading without a scroll handler", () => {
  const effect = setup({ reduced: true });
  assert.equal(effect.value("t"), 1);
  assert.equal(effect.value("rotation"), 0);
  assert.equal(effect.observations, 0);
  effect.intersect(true);
  assert.equal(effect.frames.size, 0);
  assert.equal(effect.listeners.has("scroll"), false);
  effect.reduce(false);
  effect.intersect(true);
  effect.scrollTo(470);
  assert.equal(effect.frames.size, 1);
  effect.reduce(true);
  assert.equal(effect.value("t"), 1);
  assert.equal(effect.value("rotation"), 0);
  assert.equal(effect.frames.size, 0);
  assert.equal(effect.listeners.has("scroll"), false);
  effect.dispose();
  assert.equal(effect.preference.callback, undefined);
  assert.equal(effect.properties.size, 0);
});

test("missing observation support retains the CSS fallback", () => {
  const dispose = mountTireReveal({}, {}, {});
  assert.doesNotThrow(dispose);
});

test("responsive resizing recalculates rotation while keeping the same scroll progress", () => {
  const effect = setup();
  effect.intersect(true);
  effect.scrollTo(470);
  effect.flush();
  const rotation = effect.value("rotation");
  effect.resize(416, 128);
  effect.flush();
  assert.equal(effect.value("t"), .5);
  assert.ok(Math.abs(effect.value("rotation") - rotation / 2) < .0001);
  effect.resize(352, 64);
  effect.flush();
  assert.ok(Math.abs(effect.value("rotation") - rotation) < .0001);
  assert.equal(effect.geometryReads, 8);
  effect.dispose();
});

test("position is initialized immediately before the visibility callback", () => {
  const beginning = setup();
  assert.equal(beginning.value("t"), 0);
  assert.equal(beginning.value("offset"), -576);
  assert.equal(beginning.attributes.get("data-tire-ready"), "true");
  assert.equal(beginning.frames.size, 0);
  beginning.dispose();
  const restored = setup({ initialTop: 470 });
  assert.equal(restored.value("t"), .5);
  assert.equal(restored.value("offset"), -288);
  restored.dispose();
});

test("re-entering from either direction discards stale positions immediately", () => {
  const effect = setup();
  effect.intersect(true);
  effect.scrollTo(160);
  effect.flush();
  assert.equal(effect.value("t"), 1);
  effect.intersect(false);
  effect.jumpTo(780);
  effect.intersect(true);
  assert.equal(effect.value("t"), 0);
  assert.equal(effect.frames.size, 0);
  effect.intersect(false);
  effect.jumpTo(160);
  effect.intersect(true);
  assert.equal(effect.value("t"), 1);
  effect.dispose();
});

test("unchanged scroll positions do not rewrite styles or remeasure geometry", () => {
  const effect = setup({ initialTop: 470 });
  effect.intersect(true);
  const writes = effect.writes;
  const geometryReads = effect.geometryReads;
  effect.scrollTo(470);
  effect.flush();
  assert.equal(effect.writes, writes);
  assert.equal(effect.geometryReads, geometryReads);
  effect.dispose();
});

test("browser restoration and element resizing sync progress and rolling distance", () => {
  const effect = setup();
  effect.jumpTo(470);
  effect.pageShow();
  assert.equal(effect.value("t"), .5);
  effect.intersect(true);
  const before = effect.value("rotation");
  effect.layoutResize(416, 128);
  effect.flush();
  assert.ok(Math.abs(effect.value("rotation") - before / 2) < .0001);
  effect.dispose();
  effect.pageShow();
  effect.layoutResize(704, 128);
  assert.equal(effect.frames.size, 0);
  assert.equal(effect.listeners.size, 0);
});

test("phone browser bars do not jump progress while orientation changes recalculate it", () => {
  const effect = setup({ coarse: true, initialTop: 470 });
  effect.intersect(true);
  effect.viewportResize(1000, 800);
  effect.flush();
  assert.equal(effect.value("t"), .5);
  effect.viewportResize(800, 800);
  effect.flush();
  assert.ok(effect.value("t") < .5);
  effect.dispose();
  const desktop = setup({ initialTop: 470 });
  desktop.intersect(true);
  desktop.viewportResize(1000, 800);
  desktop.flush();
  assert.ok(desktop.value("t") < .5);
  desktop.dispose();
});

test("the tire remains inside the heading at phone widths throughout the reveal", () => {
  for (const viewport of [320, 375, 425, 480]) {
    const headingWidth = viewport - (viewport < 480 ? 28 : 48);
    const tireWidth = Math.min(80, Math.max(60, viewport * .18));
    const effect = setup();
    effect.intersect(true);
    effect.resize(headingWidth, tireWidth);
    for (const top of [780, 625, 470, 315, 160, 470, 780]) {
      effect.scrollTo(top);
      effect.flush();
      const left = headingWidth - tireWidth + effect.value("offset");
      assert.ok(left >= -.001, `Tire escaped the left edge at ${viewport}px`);
      assert.ok(left + tireWidth <= headingWidth + .001, `Tire escaped the right edge at ${viewport}px`);
    }
    effect.dispose();
  }
});
