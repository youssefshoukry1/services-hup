"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import HeroSearch from "./HeroSearch";
import styles from "./home-hero.module.css";

function SceneFallback() {
  return (
    <div className={styles.fallback}>
      <Image
        src="/images/home/house-poster.webp"
        alt=""
        fill
        priority
        unoptimized
        sizes="(max-width: 849px) 100vw, 55vw"
        className={styles.poster}
      />
    </div>
  );
}

const HomeScene = dynamic(() => import("./HomeScene"), {
  ssr: false,
  loading: () => null,
});

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

export default function HomeHero() {
  const visualRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [rotating, setRotating] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const handleInteract = useCallback(() => setRotating(false), []);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(visualRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-heading"><span className={styles.desktopOnly}>Ihr Alltag.<br /><em>In guten Händen.</em></span><span className={styles.mobileOnly}>Dienstleister<br /><em>in Ihrer Nähe.</em></span></h1>
          <p className={styles.description}>Maler, Reinigung und Autoreparatur in Ihrer Nähe.</p>
          <HeroSearch />
          <div className={styles.actions}>
            <Link className={styles.primary} href="/dienstleister">Dienstleister entdecken
              <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
            </Link>
            <Link className={styles.secondary} href="/add-company">Unternehmen eintragen
              <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
        <div className={styles.visual} ref={visualRef} role="img" aria-label="3D-Haus mit einem Maler an der Fassade und einem Mechaniker, der das Auto bei geöffneter Motorhaube repariert">
          {!sceneReady && <div className={styles.preview} aria-hidden="true"><SceneFallback /></div>}
          <div className={`${styles.scene} ${sceneReady ? styles.sceneReady : ""}`} aria-hidden="true">
            <SceneBoundary><HomeScene active={visible} reducedMotion={reducedMotion} fallback={<SceneFallback />} rotating={rotating} onInteract={handleInteract} onReady={handleSceneReady} /></SceneBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
