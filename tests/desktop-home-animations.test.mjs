import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { DESKTOP_QUERY, DESKTOP_MOTION_QUERY } from "../src/app/home-hero/desktop-motion.js";

const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("motion remains desktop-only while the three-step layout is responsive", () => {
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
  assert.ok(layout.includes(`@media ${DESKTOP_MOTION_QUERY}`));
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

test("desktop effects are scoped, avoid footer pinning, and restore static state", () => {
  const calls = [];
  const triggers = [];
  const events = [];
  const blur = { style: { removeProperty(name) { delete this[name]; } } };
  const item = () => ({ style: { removeProperty(name) { delete this[name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]; } } });
  const hero = {}, content = {}, heading = {};
  const promotions = [item(), item(), item()];
  const stepContents = [{}, {}, {}];
  const stepDividers = [{}, {}, {}];
  const steps = stepContents.map((content, index) => ({ querySelector: (selector) => ({ "[data-step-content]": content, "[data-step-divider]": stepDividers[index] })[selector] }));
  const sections = [{}, {}];
  const root = {
    querySelector: (selector) => ({ "[data-desktop-blur]": blur, "[data-desktop-hero]": hero, "[data-desktop-hero-content]": content, "[data-promotion-heading]": heading })[selector],
    querySelectorAll: (selector) => ({ "[data-scroll-blur]": sections, "[data-promotion-item]": promotions, "[data-action-step]": steps })[selector],
  };
  const sandbox = {
    gsap: {
      registerPlugin() {},
      context(fn, scope) { assert.equal(scope, root); fn(); return { revert: () => events.push("context reverted") }; },
      to(target, options) { calls.push({ target, options }); return {}; },
      fromTo(target, from, options) { calls.push({ target, from, options }); return {}; },
    },
    ScrollTrigger: { create: (options) => triggers.push(options), refresh: () => events.push("refreshed") },
    SplitText: { create(target, options) { assert.equal(target, heading); options.onSplit({ lines: [{}] }); return { revert: () => events.push("split reverted") }; } },
  };
  const animationCode = source("../src/app/home-hero/desktop-home-animations.js").replace(/^import .*;\r?\n/gm, "").replace("export function", "function");
  vm.runInNewContext(animationCode, sandbox);
  const dispose = sandbox.mountDesktopAnimations(root);
  const pinned = calls.filter(({ options }) => options.scrollTrigger?.pin);
  assert.equal(pinned.length, 1);
  assert.equal(pinned[0].options.scrollTrigger.pin, hero);
  assert.equal(pinned[0].options.scrollTrigger.start, "clamp(bottom bottom)");
  assert.equal(pinned[0].options.scrollTrigger.pinSpacing, false);
  assert.equal(triggers.length, sections.length);
  const stepReveals = calls.filter(({ target }) => stepContents.includes(target));
  assert.equal(stepReveals.length, 3);
  stepReveals.forEach(({ from, options }, index) => {
    assert.equal(from.yPercent, -100);
    assert.equal(options.yPercent, 0);
    assert.equal(options.ease, "none");
    assert.equal(options.scrollTrigger.trigger, stepDividers[index]);
    assert.equal(options.scrollTrigger.start, "top bottom");
    assert.equal(options.scrollTrigger.end, "bottom 60%");
    assert.equal(options.scrollTrigger.scrub, true);
    assert.equal(options.scrollTrigger.pin, undefined);
  });
  const reveals = calls.filter(({ target }) => promotions.includes(target));
  assert.deepEqual(reveals.map(({ options }) => options.delay), [0, .15, .3]);
  reveals.forEach(({ target, options }) => {
    options.onStart();
    assert.equal(target.style.willChange, "transform, opacity");
    options.onComplete();
    assert.equal(target.style.willChange, undefined);
  });
  // Overlapping incoming sections must not turn each other's blur off.
  const first = { isActive: true }, second = { isActive: true };
  triggers[0].onToggle(first);
  triggers[1].onToggle(second);
  first.isActive = false;
  triggers[0].onToggle(first);
  assert.equal(blur.style.display, "block");
  second.isActive = false;
  triggers[1].onToggle(second);
  assert.equal(blur.style.display, "none");
  dispose();
  assert.equal(blur.style.display, undefined);
  assert.deepEqual(events, ["refreshed", "split reverted", "context reverted"]);
});
