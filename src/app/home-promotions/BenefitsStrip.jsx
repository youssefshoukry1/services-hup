"use client";

import { useEffect, useRef, useState } from "react";
import { DESKTOP_MOTION_QUERY } from "../home-hero/desktop-motion";
import styles from "./home-promotions.module.css";

export default function BenefitsStrip({ benefits }) {
  const sectionRef = useRef(null);
  const [animation, setAnimation] = useState("static");

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION_QUERY);
    let observer;
    const update = () => {
      observer?.disconnect();
      setAnimation("static");
      if (!media.matches || !window.IntersectionObserver) return;
      setAnimation("waiting");
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setAnimation("playing");
          observer.disconnect();
        }
      }, { threshold: .55 });
      observer.observe(sectionRef.current);
    };
    update();
    media.addEventListener("change", update);
    return () => { observer?.disconnect(); media.removeEventListener("change", update); };
  }, []);

  return <section ref={sectionRef} className={styles.benefitsSection} data-animation={animation} aria-label="Was Sie mit ServiceHub entdecken können">
    <dl className={styles.benefits}>
      {benefits.map((benefit, index) => <div className={styles.benefit} style={{ "--benefit-delay": `${index * 800}ms` }} key={benefit.title}>
        <dt>
          <span className={styles.benefitDesktop}>{benefit.title}</span>
          <span className={styles.benefitMobile}>{benefit.mobileTitle}</span>
        </dt>
        <dd><span className={styles.benefitDesktop}>{benefit.description}</span><span className={styles.benefitMobile}>{benefit.mobileDescription}</span></dd>
      </div>)}
    </dl>
  </section>;
}
