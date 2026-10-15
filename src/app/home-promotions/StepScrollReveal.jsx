"use client";

import { useEffect, useRef } from "react";

export default function StepScrollReveal({ className, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let dispose;
    let revision = 0;

    const update = async () => {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      try {
        const { mountStepAnimations } = await import("./step-animations");
        if (current === revision && media.matches) {
          dispose = mountStepAnimations(rootRef.current);
        }
      } catch (error) {
        console.error("Step animations could not load.", error);
      }
    };

    update();
    media.addEventListener("change", update);
    return () => {
      revision++;
      dispose?.();
      media.removeEventListener("change", update);
    };
  }, []);

  return <ol ref={rootRef} className={className} aria-label="In drei Schritten zur passenden Hilfe">
    {children}
  </ol>;
}
