"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_MOTION_QUERY } from "./desktop-motion";

export default function HomeScrollTransition({ hero, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION_QUERY);
    let dispose;
    let revision = 0;
    const update = async () => {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      try {
        const { mountHomeAnimations } = await import("./desktop-home-animations");
        if (current === revision && media.matches) {
          dispose = mountHomeAnimations(rootRef.current);
        }
      } catch (error) {
        console.error("Homepage animations could not load.", error);
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

  return <div ref={rootRef}>
    {hero}
    {children}
  </div>;
}
