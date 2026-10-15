import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { DESKTOP_QUERY, DESKTOP_MOTION_QUERY } from "../src/app/home-hero/desktop-motion.js";

const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("promotion motion remains desktop-only while step motion supports phones", () => {
  assert.equal(DESKTOP_QUERY, "(min-width: 1200px) and (hover: hover) and (pointer: fine)");
  assert.equal(DESKTOP_MOTION_QUERY, `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`);
  const layout = source("../src/app/home-promotions/action-choices.module.css");
  const original = source("../src/app/home-promotions/home-promotions.module.css");
  assert.match(layout, /\.section\s*\{\s*display: block;/);
  assert.ok(layout.includes("@media (max-width: 699px)"));
  assert.match(layout, /\.layout\s*\{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.ok(layout.includes("@media (max-width: 479px)"));
  assert.match(layout, /\.primaryLink\s*\{\s*display: flex; width: 100%;/);
  const promotions = source("../src/app/home-promotions/HomePromotions.jsx");
  assert.ok(promotions.includes("<ActionChoices />"));
  assert.doesNotMatch(promotions, /websiteActions|styles\.howSection|Was möchten Sie tun/);
  assert.ok(original.includes(`@media ${DESKTOP_MOTION_QUERY}`));
  assert.ok(layout.includes("@media (prefers-reduced-motion: no-preference)"));
  assert.match(layout, /\.step\s*\{\s*overflow: hidden;/);
  assert.doesNotMatch(layout, /opacity:\s*0|visibility:\s*hidden|translateY/);
});

test("mobile takes the static path before loading scroll-animation code", () => {
  const component = source("../src/app/home-hero/HomeScrollTransition.jsx");
  assert.ok(component.indexOf("if (!media.matches) return;") < component.indexOf('await import("./desktop-home-animations")'));
  assert.match(component, /current === revision && media.matches/);
  assert.match(component, /dispose\?\.\(\)/);
  assert.match(component, /media\.removeEventListener\("change", update\)/);
  assert.doesNotMatch(source("../src/app/home-promotions/PromotionIcon.jsx"), /IntersectionObserver|useEffect|data-animation/);
});

test("desktop effects are scoped and restore static state", () => {
  const calls = [];
  const events = [];
  const item = () => ({ style: { removeProperty(name) { delete this[name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]; } } });
  const heading = {};
  const promotions = [item(), item(), item()];
  promotions.forEach((promotion) => { promotion.parentElement = { children: promotions }; });
  const root = {
    querySelectorAll: (selector) => ({ "[data-promotion-heading]": [heading], "[data-promotion-item]": promotions })[selector],
  };
  const sandbox = {
    gsap: {
      registerPlugin() {},
      context(fn, scope) { assert.equal(scope, root); fn(); return { revert: () => events.push("context reverted") }; },
      to(target, options) { calls.push({ target, options }); return {}; },
      fromTo(target, from, options) { calls.push({ target, from, options }); return {}; },
    },
    ScrollTrigger: { refresh: () => events.push("refreshed") },
    SplitText: { create(target, options) { assert.equal(target, heading); options.onSplit({ lines: [{}] }); return { revert: () => events.push("split reverted") }; } },
  };
  const animationCode = source("../src/app/home-hero/desktop-home-animations.js").replace(/^import .*;\r?\n/gm, "").replace("export function", "function");
  vm.runInNewContext(animationCode, sandbox);
  const dispose = sandbox.mountHomeAnimations(root);
  assert.ok(calls.every(({ options }) => !options.scrollTrigger?.pin));
  const reveals = calls.filter(({ target }) => promotions.includes(target));
  assert.deepEqual(reveals.map(({ options }) => options.delay), [0, .15, .3]);
  reveals.forEach(({ target, options }) => {
    options.onStart();
    assert.equal(target.style.willChange, "transform, opacity");
    options.onComplete();
    assert.equal(target.style.willChange, undefined);
  });
  reveals[0].options.onStart();
  dispose();
  assert.equal(promotions[0].style.willChange, undefined);
  assert.deepEqual(events, ["refreshed", "split reverted", "context reverted"]);
});

function mountMotionEffect(matches, loadAnimations, steps = false) {
  let effect;
  const listeners = new Set();
  const media = {
    matches,
    addEventListener(type, callback) { assert.equal(type, "change"); listeners.add(callback); },
    removeEventListener(type, callback) { assert.equal(type, "change"); listeners.delete(callback); },
  };
  const root = {};
  const sandbox = {
    DESKTOP_MOTION_QUERY, loadAnimations, console,
    window: { matchMedia(query) { assert.equal(query, steps ? "(prefers-reduced-motion: no-preference)" : DESKTOP_MOTION_QUERY); return media; } },
    useRef: () => ({ current: root }),
    useEffect: (callback) => { effect = callback; },
  };
  const component = source(steps ? "../src/app/home-promotions/StepScrollReveal.jsx" : "../src/app/home-hero/HomeScrollTransition.jsx");
  const code = component.slice(0, component.indexOf(steps ? "  return <ol" : "  return <div"))
    .replace(/^import .*;\r?\n/gm, "")
    .replace("export default function", "function")
    .replace(steps ? 'import("./step-animations")' : 'import("./desktop-home-animations")', "loadAnimations()") + "}";
  vm.runInNewContext(code, sandbox);
  if (steps) sandbox.StepScrollReveal({});
  else sandbox.HomeScrollTransition({});
  const dispose = effect();
  return {
    root, listeners, dispose,
    change(matches) { media.matches = matches; listeners.forEach((callback) => callback()); },
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("step reveals use the desktop scroll effect at every screen size and clean up", () => {
  const calls = [];
  const events = [];
  const contents = [{}, {}, {}];
  const dividers = [{}, {}, {}];
  const steps = contents.map((content, index) => ({
    querySelector: (selector) => ({ "[data-step-content]": content, "[data-step-divider]": dividers[index] })[selector],
  }));
  const root = { querySelectorAll(selector) { assert.equal(selector, "[data-action-step]"); return steps; } };
  const sandbox = {
    gsap: {
      registerPlugin() {},
      context(fn, scope) { assert.equal(scope, root); fn(); return { revert: () => events.push("reverted") }; },
      fromTo(target, from, options) { calls.push({ target, from, options }); },
    },
    ScrollTrigger: { refresh: () => events.push("refreshed") },
  };
  const code = source("../src/app/home-promotions/step-animations.js")
    .replace(/^import .*;\r?\n/gm, "").replace("export function", "function");
  vm.runInNewContext(code, sandbox);
  const dispose = sandbox.mountStepAnimations(root);
  assert.equal(calls.length, 3);
  calls.forEach(({ target, from, options }, index) => {
    assert.equal(target, contents[index]);
    assert.equal(from.yPercent, -100);
    assert.equal(options.yPercent, 0);
    assert.equal(options.scrollTrigger.trigger, dividers[index]);
    assert.equal(options.scrollTrigger.start, "top bottom");
    assert.equal(options.scrollTrigger.end, "bottom 60%");
    assert.equal(options.scrollTrigger.scrub, true);
    assert.equal(options.scrollTrigger.pin, undefined);
  });
  dispose();
  assert.deepEqual(events, ["refreshed", "reverted"]);
});

test("phone step animations mount and restore content when reduced motion is enabled", async () => {
  let mounts = 0, disposals = 0;
  const effect = mountMotionEffect(true, async () => ({
    mountStepAnimations() { mounts++; return () => { disposals++; }; },
  }), true);
  await settle();
  assert.equal(mounts, 1);
  effect.change(false);
  assert.equal(disposals, 1);
  effect.change(true);
  await settle();
  assert.equal(mounts, 2);
  effect.dispose();
  assert.equal(disposals, 2);
  assert.equal(effect.listeners.size, 0);
});

test("step animations skip loading for reduced motion and cannot mount after unmounting", async () => {
  let resolveLoad, mounts = 0, loads = 0;
  const effect = mountMotionEffect(false, () => {
    loads++;
    return new Promise((resolve) => { resolveLoad = resolve; });
  }, true);
  await settle();
  assert.equal(loads, 0);
  effect.change(true);
  effect.dispose();
  resolveLoad({ mountStepAnimations() { mounts++; } });
  await settle();
  assert.equal(mounts, 0);
});

test("phones do not download or mount scroll animations", async () => {
  let loads = 0;
  const effect = mountMotionEffect(false, () => { loads++; throw new Error("Mobile loaded animations"); });
  await settle();
  effect.change(false);
  await settle();
  assert.equal(loads, 0);
  effect.dispose();
  assert.equal(effect.listeners.size, 0);
});

test("changing from desktop to phone restores static content", async () => {
  let mounts = 0, disposals = 0;
  const effect = mountMotionEffect(true, async () => ({
    mountHomeAnimations(root) {
      assert.equal(root, effect.root);
      mounts++;
      return () => { disposals++; };
    },
  }));
  await settle();
  assert.equal(mounts, 1);
  effect.change(false);
  assert.equal(disposals, 1);
  effect.change(true);
  await settle();
  assert.equal(mounts, 2);
  effect.dispose();
  assert.equal(disposals, 2);
  assert.equal(effect.listeners.size, 0);
});

test("a pending animation import cannot mount after switching to phone or unmounting", async () => {
  let resolveLoad, mounts = 0;
  const effect = mountMotionEffect(true, () => new Promise((resolve) => { resolveLoad = resolve; }));
  const animations = { mountHomeAnimations() { mounts++; return () => {}; } };
  effect.change(false);
  resolveLoad(animations);
  await settle();
  assert.equal(mounts, 0);
  effect.change(true);
  effect.dispose();
  resolveLoad(animations);
  await settle();
  assert.equal(mounts, 0);
});
