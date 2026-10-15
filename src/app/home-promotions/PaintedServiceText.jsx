"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./mobile-service-promotion.module.css";

function PaintRoller() {
  return (
    <svg className={styles.paintRoller} viewBox="0 0 30 60" fill="none" aria-hidden="true">
      <path d="M16 10h8v29H12v12" stroke="#243932" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="2" width="15" height="32" rx="4" fill="#007975" stroke="#f0f6f2" strokeWidth="2" />
      <path d="M6 8v19" stroke="#9ad5c8" strokeWidth="2" strokeLinecap="round" />
      <rect x="8" y="47" width="8" height="12" rx="3" fill="#243932" />
    </svg>
  );
}

export default function PaintedServiceText({ reverse = false }) {
  const textRef = useRef(null);
  const [animation, setAnimation] = useState("static");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let observer;
    const update = () => {
      observer?.disconnect();
      setAnimation("static");
      if (!media.matches || !window.IntersectionObserver) return;

      setAnimation("waiting");
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        setAnimation("playing");
        observer.disconnect();
      }, { threshold: .7 });
      observer.observe(textRef.current);
    };

    update();
    media.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <span ref={textRef} className={styles.accent} data-paint={animation} data-paint-direction={reverse ? "reverse" : "forward"}>
      <span className={styles.desktopCopy}>
        <span className={`${styles.paintWords} ${styles.paintLead}`}>
          {reverse ? "Überlassen Sie" : "Nur ein paar"}
          <PaintRoller />
        </span>{" "}
        <span className={styles.paintWords}>
          {reverse ? "es den Profis." : "Klicks entfernt."}
          <PaintRoller />
        </span>
      </span>
      <span className={styles.mobileCopy}>
        <span className={`${styles.paintWords} ${styles.paintLead}`}>
          {reverse ? "Profis helfen" : "Einfach per"}
          <PaintRoller />
        </span>{" "}
        <span className={styles.paintWords}>
          {reverse ? "weiter." : "Handy."}
          <PaintRoller />
        </span>
      </span>
    </span>
  );
}
