"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./cards-services.module.css";

const services = [
  {
    number: "01",
    title: "Malerarbeiten",
    image: "/images/services/painting-service.webp",
    alt: "Türkiser Farbroller, Pinsel und Farbeimer",
    href: "/services/painters",
  },
  {
    number: "02",
    title: "Grundreinigung",
    image: "/images/services/cleaning-service.webp",
    alt: "Reinigungsspray, Tuch und Bürste",
    href: "/services/cleaning",
  },
  {
    number: "03",
    title: "Autoreparatur",
    image: "/images/services/car-repair-service.webp",
    alt: "Modernes Auto mit professionellem Werkzeug",
    href: "/services/auto_repair",
  },
];

export default function CardsServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll("[data-service-card]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add(styles.visible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="services-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>Dienstleistungen, denen Sie vertrauen können</span>
          <h2 id="services-heading">Hilfe für den Alltag.</h2>
        </header>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <article data-service-card className={`${styles.reveal} ${index % 2 === 0 ? styles.fromLeft : styles.fromRight}`} key={service.title}>
              <div className={styles.perspective}>
                <div className={styles.card}>
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 699px) 320px, (max-width: 1049px) 45vw, 340px" className={styles.image} />
                  <div className={styles.imageShade} aria-hidden="true" />
                  <div className={styles.badge} aria-hidden="true">
                    <span>Dienstleistung</span>
                    <strong>{service.number}</strong>
                  </div>
                  <div className={styles.content}>
                    <h3>{service.title}</h3>
                    <Link href={service.href} className={styles.button}>
                      Mehr erfahren
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
