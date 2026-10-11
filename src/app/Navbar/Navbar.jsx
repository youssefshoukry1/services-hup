"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import NavbarSearch from "./NavbarSearch";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 80);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`${styles.shell} ${isScrolled ? styles.scrolled : ""}`}>
      <nav aria-label="Hauptnavigation" className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="ServiceHub Startseite">
          Service<span>Hub</span>
        </Link>
        <NavbarSearch isScrolled={isScrolled} />
        <Link href="/add-company" className={styles.cta} aria-label="Unternehmenseintrag vorbereiten">
          <span className={styles.ctaFull}>Eintrag vorbereiten</span>
          <span className={styles.ctaCompact}>Eintrag erstellen</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
