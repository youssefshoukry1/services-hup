"use client";

import { useEffect, useRef } from "react";

export default function HomeScrollTransition({ hero, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let dispose;
    let revision = 0;
    const update = async () => {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
      if (!motion.matches) return;
      try {
        const { mountHomeAnimations } = await import("./desktop-home-animations");
        if (current === revision && motion.matches) {
          dispose = mountHomeAnimations(rootRef.current);
        }
      } catch (error) {
        console.error("Homepage animations could not load.", error);
      }
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      revision++;
      dispose?.();
      motion.removeEventListener("change", update);
    };
  }, []);

  return <div ref={rootRef}>
    {hero}
    {children}
  </div>;
}
