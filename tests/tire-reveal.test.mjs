import assert from "node:assert/strict";
import test from "node:test";
import { mountTireReveal, tireFrame } from "../src/app/home-promotions/tire-reveal.js";

function setup({ reduced = false } = {}) {
  let top = 780, nextFrame = 0, time = 0, reads = 0, geometryReads = 0, observerCallback, observations = 0;
  let trackWidth = 704, tireWidth = 128;
  const frames = new Map(), listeners = new Map(), properties = new Map(), attributes = new Map();
  const preference = {
    matches: reduced,
    addEventListener(type, callback) { this.callback = callback; },
    removeEventListener(type, callback) { assert.equal(callback, this.callback); this.callback = undefined; },
  };
  const win = {
    innerHeight: 1000,
    matchMedia(query) { assert.equal(query, "(prefers-reduced-motion: reduce)"); return preference; },
    IntersectionObserver: class {
      constructor(callback) { observerCallback = callback; }
      observe() { observations++; }
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
    style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) },
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: (key) => attributes.delete(key),
  };
  const dispose = mountTireReveal(section, headline, win);
  return {
    frames, listeners, properties, attributes, preference, dispose,
    get reads() { return reads; },
    get geometryReads() { return geometryReads; },
    get observations() { return observations; },
    value(name) { return Number(properties.get(`--tire-${name}`)); },
    intersect(isIntersecting) { observerCallback([{ isIntersecting }]); },
    scrollTo(nextTop) { top = nextTop; listeners.get("scroll")?.(); },
    resize(nextTrackWidth, nextTireWidth) { trackWidth = nextTrackWidth; tireWidth = nextTireWidth; listeners.get("resize")?.(); },
    reduce(matches) { preference.matches = matches; preference.callback?.(); },
    flush() {
      let count = 0;
      while (frames.size) {
        assert.ok(count++ < 400, "Animation never settled");
        const callbacks = [...frames.values()];
        frames.clear();
        time += 1000 / 60;
        callbacks.forEach((callback) => callback(time));
      }
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

test("the scroll window reveals and reverses without measuring on every smoothing frame", () => {
  const effect = setup();
  assert.equal(effect.listeners.size, 0);
  effect.intersect(true);
  effect.flush();
  assert.equal(effect.value("t"), 0);
  effect.scrollTo(160);
  effect.flush();
  assert.equal(effect.value("t"), 1);
  const finalRotation = effect.value("rotation");
  assert.ok(finalRotation > 360);
  assert.equal(effect.reads, 2);
  assert.equal(effect.geometryReads, 2);
  effect.scrollTo(470);
  effect.flush();
  assert.equal(effect.value("t"), .5);
  assert.ok(Math.abs(effect.value("rotation") - finalRotation / 2) < .0001);
  effect.scrollTo(780);
  effect.flush();
  assert.equal(effect.value("t"), 0);
  assert.equal(effect.value("rotation"), 0);
  assert.equal(effect.geometryReads, 2);
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
  assert.equal(effect.listeners.size, 0);
  assert.equal(effect.attributes.size, 0);
  assert.equal(effect.reads, 1);
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
  assert.equal(effect.listeners.size, 0);
  effect.reduce(false);
  effect.intersect(true);
  effect.scrollTo(470);
  assert.equal(effect.frames.size, 1);
  effect.reduce(true);
  assert.equal(effect.value("t"), 1);
  assert.equal(effect.value("rotation"), 0);
  assert.equal(effect.frames.size, 0);
  assert.equal(effect.listeners.size, 0);
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
  assert.equal(effect.geometryReads, 6);
  effect.dispose();
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
