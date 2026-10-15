"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ServiceIcon from "../ServiceIcon";
import { DESKTOP_MOTION_QUERY } from "../home-hero/desktop-motion";
import styles from "./service-promotion.module.css";

const services = [
  { id: "painters", title: "Malerarbeiten", description: "Frische Farbe für Ihr Zuhause." },
  { id: "cleaning", title: "Reinigung", description: "Mehr Zeit. Ein sauberes Zuhause." },
  { id: "auto_repair", title: "Autoreparatur", description: "Hilfe für Ihr Auto vor Ort." },
];

export default function ServicePromotion() {
  const gridRef = useRef(null);
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
        if (!entry.isIntersecting) return;
        setAnimation("playing");
        observer.disconnect();
      }, { threshold: .25, rootMargin: "0px 0px -5% 0px" });
      observer.observe(gridRef.current);
    };

    update();
    media.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="service-promotion-heading">
      <div className={styles.container}>
        <div className={styles.headline}>
          <h2 id="service-promotion-heading">Wobei brauchen Sie Hilfe?</h2>
        </div>
        <ul ref={gridRef} className={styles.grid} data-animation={animation}>
          {services.map((service) => (
            <li key={service.id}>
              <Link href={`/services/${service.id}`} className={styles.card}>
                <span className={styles.icon}><ServiceIcon type={service.id} /></span>
                <div className={styles.copy}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className={styles.action}>Entdecken
                  <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
