"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CompanyLogo from "../../CompanyLogo";
import styles from "./service-page.module.css";

const sortOptions = [
  { value: "recommended", label: "Empfohlen", detail: "Ursprüngliche Reihenfolge" },
  { value: "nearby", label: "Nächste Region", detail: "Ungefähre Nähe" },
  { value: "alphabetical", label: "Name A–Z", detail: "Alphabetisch sortieren" },
  { value: "price", label: "Niedrigster Einstiegspreis", detail: "Günstigste zuerst" },
];

const areaOptions = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main"].map((city) => ({ label: city, area: city, city }));

const normalize = (value) => value.trim().toLocaleLowerCase("de-DE")
  .replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "ss");

function areaScore(company, location) {
  const address = normalize(company.address);
  if (address.includes(normalize(location.area))) return 2;
  if (address.includes(normalize(location.city))) return 1;
  return 0;
}

function getLowestPrice(company) {
  const prices = company.prices
    .map((item) => Number(item.price.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(",", ".")))
    .filter(Number.isFinite);

  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

function Icon({ type }) {
  const paths = {
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2.5l-4-1.5-1.3 2.1a13 13 0 0 1-8.8-8.8L9 7 7.5 3Z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.5 12 13l9-6.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />,
    external: <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6m0-6-9 9m7 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export default function CompanyDirectory({ companies }) {
  const directoryRef = useRef(null);
  const sortRef = useRef(null);
  const sortButtonRef = useRef(null);
  const locationRef = useRef(null);
  const locationButtonRef = useRef(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [areaQuery, setAreaQuery] = useState("");

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (event) => {
      if (!sortRef.current?.contains(event.target)) setSortOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setSortOpen(false);
      sortButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!locationOpen) return;
    const onPointerDown = (event) => {
      if (!locationRef.current?.contains(event.target)) setLocationOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setLocationOpen(false);
      locationButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [locationOpen]);

  const visibleCompanies = useMemo(() => {
    const normalizedQuery = normalize(query);
    const matches = companies.filter((company) =>
      [company.name, company.address, company.shortDesc].some((value) =>
        normalize(value).includes(normalizedQuery),
      ),
    );

    if (sortBy === "alphabetical") {
      return [...matches].sort((first, second) => first.name.localeCompare(second.name, "de-DE"));
    }

    if (sortBy === "price") {
      return [...matches].sort((first, second) => getLowestPrice(first) - getLowestPrice(second));
    }

    if (sortBy === "nearby" && location) {
      return [...matches].sort((first, second) => areaScore(second, location) - areaScore(first, location));
    }

    return matches;
  }, [companies, query, sortBy, location]);

  const filteredAreas = areaOptions.filter((item) => normalize(item.label).includes(normalize(areaQuery)));

  function selectSort(value) {
    setSortOpen(false);
    if (value === "nearby" && !location) {
      setLocationOpen(true);
      return;
    }
    setSortBy(value);
    sortButtonRef.current?.focus();
  }

  function selectLocation(value) {
    setLocation(value);
    setLocationOpen(false);
    setAreaQuery("");
    setSortBy("nearby");
    locationButtonRef.current?.focus();
  }

  useEffect(() => {
    const directory = directoryRef.current;
    if (!directory) return;

    const cards = directory.querySelectorAll("[data-company-card]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      cards.forEach((card) => card.classList.add(styles.companyVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.companyVisible);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5%" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [visibleCompanies]);

  return (
    <section ref={directoryRef} id="companies" className={styles.directory} aria-labelledby="directory-heading">
      <header className={styles.directoryHeading}>
        <div>
          <h2 id="directory-heading">Wählen Sie einen Fachbetrieb.</h2>
        </div>
      </header>

      <div className={styles.directoryTools}>
        <label className={styles.searchBox}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-4-4" />
          </svg>
          <span className="sr-only">Unternehmen suchen</span>
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nach Unternehmen oder Ort suchen"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Suche löschen">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </label>

        <div ref={sortRef} className={styles.sortWrap}>
          <button ref={sortButtonRef} type="button" className={styles.sortBox} aria-label={`Unternehmen sortieren: ${sortOptions.find((option) => option.value === sortBy).label}`} aria-expanded={sortOpen} aria-controls="company-sort-options" onClick={() => setSortOpen((open) => !open)}>
            <span className={styles.sortLabel}>Sortieren</span>
            <span className={styles.sortValue}>{sortOptions.find((option) => option.value === sortBy).label}</span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
            </svg>
          </button>
          {sortOpen && (
            <div id="company-sort-options" className={styles.sortMenu}>
              {sortOptions.map((option) => (
                <button key={option.value} type="button" className={`${styles.sortOption} ${sortBy === option.value ? styles.sortSelected : ""}`} aria-pressed={sortBy === option.value} onClick={() => selectSort(option.value)}>
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                  {sortBy === option.value && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" /></svg>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={locationRef} className={styles.locationPickerWrap}>
          <button ref={locationButtonRef} type="button" className={styles.locationPickerButton} aria-expanded={locationOpen} aria-controls="company-area-options" onClick={() => { setLocationOpen((open) => !open); setSortOpen(false); }}>
            <Icon type="location" />
            <span>{location?.label ?? "Region wählen"}</span>
          </button>
          {locationOpen && (
            <div id="company-area-options" className={styles.locationMenu}>
              <div className={styles.locationMenuHeading}><strong>Wählen Sie Ihre Region</strong><small>Die Nähe ist nur eine Schätzung.</small></div>
              <label className={styles.areaSearch}>
                <span className="sr-only">Region suchen</span>
                <input type="text" value={areaQuery} onChange={(event) => setAreaQuery(event.target.value)} placeholder="Stadt suchen" autoFocus />
              </label>
              <div className={styles.areaList}>
                {filteredAreas.length ? filteredAreas.map((item) => <button key={item.label} type="button" className={styles.areaOption} onClick={() => selectLocation(item)}>{item.label}{location?.label === item.label && <span aria-hidden="true">✓</span>}</button>) : <p className={styles.areaEmpty}>Keine Regionen gefunden</p>}
              </div>
              {location && <button type="button" className={styles.clearArea} onClick={() => { setLocation(null); setLocationOpen(false); setSortBy("recommended"); }}>Region löschen</button>}
            </div>
          )}
        </div>
      </div>

      {visibleCompanies.length > 0 ? (
        <div className={styles.companyGrid}>
          {visibleCompanies.map((company, index) => (
            <article
              id={company.id}
              data-company-card
              className={styles.companyReveal}
              style={{ "--company-delay": `${(index % 2) * 110}ms` }}
              key={company.id}
            >
              <div className={styles.companyCard}>
              <Link className={styles.cardDetailLink} href={`/services/${company.categoryId}/${company.id}`} aria-label={`Alle Details zu ${company.name}`} />
              <header className={styles.companyHeader}>
                <div className={styles.companyLogo}>
                  <CompanyLogo company={company} alt={`${company.name} Logo`} sizes="64px" className={styles.companyLogoImage} />
                </div>
                <div className={styles.companyIdentity}>
                  <h3>{company.name}</h3>
                </div>
              </header>

              <p className={styles.companyDescription}>{company.shortDesc}</p>

              <div className={styles.location}>
                <Icon type="location" />
                <span>{company.address}</span>
              </div>

              <div className={styles.pricePanel}>
                <div className={styles.priceHeading}>
                  <span>Leistungen &amp; Preise</span>
                </div>
                <ul>
                  {company.prices.map((item) => (
                    <li key={item.service}>
                      <span>{item.service}</span>
                      <strong>{item.price}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className={styles.companyActions}>
                <a className={styles.callButton} href={`tel:${company.phone.replace(/\s/g, "")}`}>
                  <Icon type="phone" />
                  Jetzt anrufen
                </a>
                <a className={styles.iconButton} href={`mailto:${company.email}`} aria-label={`E-Mail an ${company.name}`}>
                  <Icon type="mail" />
                </a>
                <a className={styles.websiteButton} href={company.website} target="_blank" rel="noreferrer">
                  Webseite
                  <Icon type="external" />
                </a>
              </footer>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-4-4M8.5 11h5" />
            </svg>
          </div>
          <h3>Keine Unternehmen gefunden</h3>
          <p>Versuchen Sie einen anderen Firmennamen oder Ort.</p>
          <button type="button" onClick={() => setQuery("")}>Suche löschen</button>
        </div>
      )}
    </section>
  );
}
