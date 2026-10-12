"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_MOTION_QUERY } from "./desktop-motion";
import styles from "./home-scroll-transition.module.css";

export default function HomeScrollTransition({ hero, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION_QUERY);
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
          dispose = mountHomeAnimations(rootRef.current, { desktop: media.matches });
        }
      } catch (error) {
        console.error("Homepage animations could not load.", error);
      }
    };
    update();
    media.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      revision++;
      dispose?.();
      media.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return <div ref={rootRef}>
    <div className={styles.hero} data-desktop-hero=""><div data-desktop-hero-content="">{hero}</div></div>
    <div className={styles.nextSection}>{children}</div>
    <div className={styles.blur} data-desktop-blur="" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <div key={index} className={styles.blurLayer} style={{ "--blur": `${2 ** index / 12.8}px`, "--start": `${index * 12.5}%`, "--middle": `${(index + 1) * 12.5}%`, "--end": `${(index + 2) * 12.5}%` }} />)}</div>
  </div>;
}
