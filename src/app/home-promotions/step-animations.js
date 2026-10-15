import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function mountStepAnimations(root) {
  const context = gsap.context(() => {
    // Reveal each row from its stationary divider as it enters the viewport.
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
  return () => context.revert();
}
