"use client";

import { useEffect, useRef, useState } from "react";
import StepIllustration from "./StepIllustration";
import styles from "./home-promotions.module.css";

export default function PromotionIcon({ type, index }) {
  const iconRef = useRef(null);
  const [animation, setAnimation] = useState("static");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !window.IntersectionObserver) return;

    setAnimation("waiting");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimation("playing");
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(iconRef.current);

    const stopAnimation = (event) => {
      if (event.matches) {
        observer.disconnect();
        setAnimation("static");
      }
    };
    preference.addEventListener("change", stopAnimation);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopAnimation);
    };
  }, []);

  return (
    <span ref={iconRef} className={styles.iconReveal} data-animation={animation} style={{ "--icon-stagger": `${index * 220}ms` }} aria-hidden="true">
      <StepIllustration type={type} className={styles.promotionIcon} />
    </span>
  );
}
