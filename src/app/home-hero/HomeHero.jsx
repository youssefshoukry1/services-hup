"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import HeroSearch from "./HeroSearch";
import styles from "./home-hero.module.css";

function SceneFallback() {
  return (
    <div className={styles.fallback}>
      <svg viewBox="0 0 540 460" fill="none" aria-hidden="true">
        <ellipse cx="275" cy="367" rx="200" ry="38" fill="#d1d9d3" opacity=".5" />
        <path d="m63 321 214-90 207 98v15l-214 90-207-98Z" fill="#cfd5cd" />
        <path d="m63 321 214-90 207 98-214 90Z" fill="#a6b396" />
        <path d="m246 330 104-44 118 57-105 44Z" fill="#d7d9d1" />
        <path d="m123 305 104-43 111 53-104 44Z" fill="#c6c8bd" />
        <path d="m137 172 117-49 107 51v153l-116 50-108-52Z" fill="#d2c5af" />
        <path d="m254 123 107 51v153l-116 50V218Z" fill="#c5b9a4" />
        <path d="m140 253 50 24v64l-50-24Z" fill="#f1eee5" />
        <path d="m188 194 7 7-3 11 9 10-5 14" stroke="#867969" strokeWidth="2" strokeLinecap="round" />
        <path d="m198 290 13 6 4 14-8 6-12-8Z" fill="#b18c73" />
        <path d="m122 174 125-116 125 110-127 54Z" fill="#435258" />
        <path d="m247 58 34-14 125 110-34 14Z" fill="#303e44" />
        <path d="m245 222 127-54-125-110Z" fill="#344249" />
        <path d="m256 75 124 109m-141-103 126 109m-143-101 126 109m-143-101 126 109" stroke="#657077" strokeWidth="2" />
        <path d="m268 197 77-33 67 33v119l-77 33-67-32Z" fill="#d5cab6" />
        <path d="m268 197 77-33 75 35-78 33Z" fill="#526065" />
        <path d="m342 232 70-30v114l-70 30Z" fill="#c7cdc6" />
        <path d="m282 233 45 22v65l-45-22Z" fill="#647477" />
        <path d="m282 247 45 22m-45-8 45 22m-45-8 45 22m-45-8 45 22" stroke="#849191" />
        <path d="m198 263 32 15v78l-32-16Z" fill="#9e7b57" />
        <path d="m206 275 16 8v65l-16-8Z" fill="#354b4e" />
        <g fill="#83a8ae" stroke="#435357" strokeWidth="4">
          <path d="m158 206 27 13v39l-27-13Z" />
          <path d="m208 230 27 13v39l-27-13Z" />
          <path d="m157 269 27 13v32l-27-13Z" />
          <path d="m273 219 24-10v35l-24 10Z" />
          <path d="m316 201 25-11v35l-25 11Z" />
        </g>
        <path d="m311 330 43-18 52 25v27l-42 18-53-25Z" fill="#2d7478" />
        <path d="m325 328 25-25 39 18 10 22-36 15Z" fill="#324b54" />
        <path d="m350 303 39 18-26 11-38-18Z" fill="#438488" />
        <path d="m364 358 35-15v9l-35 15Z" fill="#a6c0c3" />
        <ellipse cx="325" cy="353" rx="7" ry="11" fill="#2b3438" />
        <ellipse cx="373" cy="375" rx="7" ry="11" fill="#2b3438" />
        <ellipse cx="325" cy="353" rx="3" ry="5" fill="#9faeaf" />
        <ellipse cx="373" cy="375" rx="3" ry="5" fill="#9faeaf" />
        <path d="m365 345 28-12 9 11-28 12Z" fill="#253638" />
        <path d="m361 323 29-13 10 23-29 13Z" fill="#3b8285" stroke="#35585b" strokeWidth="2" />
        <g transform="translate(424 349)">
          <path d="m-5 8 4 31m10-27 9 27" stroke="#385762" strokeWidth="9" strokeLinecap="round" />
          <path d="m-4 41 8 1m10-1 10 1" stroke="#344343" strokeWidth="7" strokeLinecap="round" />
          <path d="m-23-18 7 18 22 15 7-11-23-25Z" fill="#438b89" />
          <path d="m-18-9-12 8-3 12m23-13-7 9-12 8" stroke="#a97552" strokeWidth="6" strokeLinecap="round" />
          <circle cx="-25" cy="-24" r="9" fill="#a97552" />
          <path d="M-36-28a12 12 0 0 1 23 0Z" fill="#385762" />
          <path d="M-40-27h24" stroke="#385762" strokeWidth="4" strokeLinecap="round" />
          <path d="m-35 13-9-6" stroke="#c2ccc4" strokeWidth="3" strokeLinecap="round" />
          <path d="m15 29 16 5v14l-16-5Z" fill="#a3634e" />
          <path d="m20 29 1-5 6 2 1 5" stroke="#344343" strokeWidth="2" fill="none" />
        </g>
        <path d="M123 301v20" stroke="#0c7d79" strokeWidth="14" />
        <path d="m125 300-3-26 15-5" stroke="#718986" strokeWidth="3" />
        <path d="m129 266 24 11" stroke="#d8ded4" strokeWidth="9" strokeLinecap="round" />
        <g transform="translate(157 330)">
          <path d="m-9 19-2 18m12-18 6 18" stroke="#365d61" strokeWidth="9" strokeLinecap="round" />
          <path d="m-15 38 9 1m8-1 10 1" stroke="#344343" strokeWidth="7" strokeLinecap="round" />
          <path d="m-9-12 3 32h12l-1-31Z" fill="#127b7a" />
          <path d="m4-8 12-8 6-16" stroke="#c18d66" strokeWidth="6" strokeLinecap="round" />
          <path d="m-7-6-8 10 16 1" stroke="#127b7a" strokeWidth="7" strokeLinecap="round" />
          <circle cx="-4" cy="-22" r="9" fill="#c18d66" />
          <path d="M-16-26a12 12 0 0 1 24 0Z" fill="#d9af57" />
          <path d="M-17-25H10" stroke="#d9af57" strokeWidth="4" strokeLinecap="round" />
          <path d="m0 9 28-50" stroke="#889a94" strokeWidth="2.5" />
          <path d="m23-44 14 6" stroke="#f1eee5" strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

const HomeScene = dynamic(() => import("./HomeScene"), {
  ssr: false,
  loading: SceneFallback,
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
  const handleInteract = useCallback(() => setRotating(false), []);

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
            <Link className={styles.primary} href="/dienstleister">Dienstleister entdecken <span aria-hidden="true">↗</span></Link>
            <Link className={styles.secondary} href="/add-company">Unternehmen eintragen <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className={styles.visual} ref={visualRef} role="img" aria-label="3D-Haus mit einem Maler an der Fassade und einem Mechaniker, der das Auto bei geöffneter Motorhaube repariert">
          <div className={styles.scene} aria-hidden="true">
            <SceneBoundary><HomeScene active={visible} reducedMotion={reducedMotion} fallback={<SceneFallback />} rotating={rotating} onInteract={handleInteract} /></SceneBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
