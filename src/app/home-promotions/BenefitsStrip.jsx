"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./home-promotions.module.css";

function AnimatedTitle({ text, className, delay }) {
  const words = text.split(" ");
  let offset = 0;

  return <span className={className}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">
      {words.map((word, wordIndex) => {
        const start = offset;
        offset += Array.from(word).length + 1;
        return <Fragment key={wordIndex}>
          <span className={styles.typingWord}>
            {Array.from(word).map((letter, index) => <span className={styles.typingLetter} style={{ "--benefit-letter-delay": `${delay + (start + index) * 32}ms` }} key={index}>{letter}</span>)}
          </span>
          {wordIndex < words.length - 1 && " "}
        </Fragment>;
      })}
    </span>
  </span>;
}

export default function BenefitsStrip({ benefits }) {
  const sectionRef = useRef(null);
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
    }, { threshold: 0.15 });
    observer.observe(sectionRef.current);

    const stopAnimation = (event) => {
      if (event.matches) { observer.disconnect(); setAnimation("static"); }
    };
    preference.addEventListener("change", stopAnimation);
    return () => { observer.disconnect(); preference.removeEventListener("change", stopAnimation); };
  }, []);

  return <section ref={sectionRef} className={styles.benefitsSection} data-animation={animation} aria-label="Was Sie mit ServiceHub entdecken können">
    <dl className={styles.benefits}>
      {benefits.map((benefit, index) => <div className={styles.benefit} key={benefit.title}>
        <dt>
          <AnimatedTitle className={styles.benefitDesktop} text={benefit.title} delay={index * 180} />
          <AnimatedTitle className={styles.benefitMobile} text={benefit.mobileTitle} delay={index * 180} />
        </dt>
        <dd><span className={styles.benefitDesktop}>{benefit.description}</span><span className={styles.benefitMobile}>{benefit.mobileDescription}</span></dd>
      </div>)}
    </dl>
  </section>;
}
