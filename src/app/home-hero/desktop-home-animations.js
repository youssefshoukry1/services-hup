import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function mountHomeAnimations(root) {
  const splits = [];

  const context = gsap.context(() => {
    root.querySelectorAll("[data-promotion-heading]").forEach((heading) => {
      const split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: true,
        onSplit: (instance) => gsap.fromTo(instance.lines, { opacity: 0, yPercent: 100, rotation: 1 }, {
          opacity: 1, yPercent: 0, rotation: 0, duration: .5, stagger: .2, ease: "sine.out",
          scrollTrigger: { trigger: heading, start: "top 90%", toggleActions: "play none none reset" },
        }),
      });
      splits.push(split);
    });

    root.querySelectorAll("[data-promotion-item]").forEach((item) => {
      const index = Array.from(item.parentElement.children).indexOf(item);
      gsap.fromTo(item, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: .5, delay: index * .15, ease: "sine.out", force3D: "auto",
        onStart: () => { item.style.willChange = "transform, opacity"; },
        onComplete: () => { item.style.removeProperty("will-change"); },
        onInterrupt: () => { item.style.removeProperty("will-change"); },
        scrollTrigger: { trigger: item, start: "top 90%", toggleActions: "play none none reset" },
      });
    });

    // A/02's stats rows reveal from above their stationary divider, tied to scroll.
    // Animate just one container per step, without text splitting or filters.
    root.querySelectorAll("[data-action-step]").forEach((step) => {
      gsap.fromTo(step.querySelector("[data-step-content]"), { yPercent: -100 }, {
        yPercent: 0, ease: "none", force3D: "auto",
        scrollTrigger: {
          trigger: step.querySelector("[data-step-divider]"),
          start: "top bottom", end: "bottom 60%", scrub: true,
          toggleActions: "play none none reverse",
        },
      });
    });
  }, root);

  ScrollTrigger.refresh();
  return () => {
    splits.forEach((split) => split.revert());
    context.revert();
    root.querySelectorAll("[data-promotion-item]").forEach((item) => item.style.removeProperty("will-change"));
  };
}
