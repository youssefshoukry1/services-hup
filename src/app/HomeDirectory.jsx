"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mockData } from "../../mockData";
import { getApprovedCompanies } from "../lib/api";
import CompanyLogo from "./CompanyLogo";
import ServiceIcon from "./ServiceIcon";
import styles from "./home-directory.module.css";

const labels = { painters: "Malerarbeiten", cleaning: "Reinigung", auto_repair: "Autoreparatur" };
const regions = [
  { name: "Berlin", lat: 52.52, lon: 13.405 },
  { name: "Hamburg", lat: 53.551, lon: 9.994 },
  { name: "München", lat: 48.137, lon: 11.576 },
  { name: "Köln", lat: 50.938, lon: 6.96 },
  { name: "Frankfurt am Main", lat: 50.11, lon: 8.682 },
];
const normalize = (value) => value.trim().toLocaleLowerCase("de-DE");
const sortOptions = [
  { value: "recommended", label: "Empfohlen", detail: "Ursprüngliche Reihenfolge" },
  { value: "alphabetical", label: "Name A–Z", detail: "Alphabetisch sortieren" },
  { value: "price-asc", label: "Preis: niedrig bis hoch", detail: "Niedrigster Einstiegspreis zuerst" },
  { value: "price-desc", label: "Preis: hoch bis niedrig", detail: "Höchster Einstiegspreis zuerst" },
];

function distanceKm(lat1, lon1, lat2, lon2) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const arc = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function lowestPrice(company) {
  return Math.min(...company.prices.map((item) => Number(item.price.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(",", "."))).filter(Number.isFinite));
}

export default function HomeDirectory() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [region, setRegion] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const [areaQuery, setAreaQuery] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const regionRef = useRef(null);
  const regionButtonRef = useRef(null);
  const sortRef = useRef(null);
  const sortButtonRef = useRef(null);
  const categoryRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const mixedCompanies = Array.from(
    { length: Math.max(0, ...mockData.categories.map((item) => allCompanies.filter((company) => company.categoryId === item.id).length)) },
    (_, index) => mockData.categories.map((item) => allCompanies.filter((company) => company.categoryId === item.id)[index]).filter(Boolean),
  ).flat();
  const companies = (category === "all" ? mixedCompanies : allCompanies.filter((company) => company.categoryId === category))
    .filter((company) => !region || company.address.endsWith(region))
    .sort((first, second) => sortBy === "alphabetical" ? first.name.localeCompare(second.name, "de-DE") : sortBy === "price-asc" ? lowestPrice(first) - lowestPrice(second) : sortBy === "price-desc" ? lowestPrice(second) - lowestPrice(first) : 0);
  const filters = [{ id: "all", title: "Alle Dienstleistungen" }, ...mockData.categories.map((item) => ({ id: item.id, title: labels[item.id] ?? item.title }))];

  useEffect(() => {
    let active = true;
    getApprovedCompanies().then((items) => { if (active) setAllCompanies(items); }).catch(() => { if (active) setLocationMessage("Unternehmen konnten nicht geladen werden."); }).finally(() => { if (active) setCompaniesLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!regionOpen) return;
    const onPointerDown = (event) => { if (!regionRef.current?.contains(event.target)) setRegionOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") { setRegionOpen(false); regionButtonRef.current?.focus(); } };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [regionOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (event) => { if (!sortRef.current?.contains(event.target)) setSortOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") { setSortOpen(false); sortButtonRef.current?.focus(); } };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [sortOpen]);

  useEffect(() => {
    if (!categoryOpen) return;
    const onPointerDown = (event) => { if (!categoryRef.current?.contains(event.target)) setCategoryOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") { setCategoryOpen(false); categoryButtonRef.current?.focus(); } };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [categoryOpen]);

  function detectLocation() {
    if (!navigator.geolocation) { setLocationMessage("Standorterkennung wird nicht unterstützt."); return; }
    setDetecting(true);
    setLocationMessage("");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const nearest = regions.map((item) => ({ ...item, distance: distanceKm(coords.latitude, coords.longitude, item.lat, item.lon) })).sort((a, b) => a.distance - b.distance)[0];
      if (nearest.distance <= 75) {
        setRegion(nearest.name);
        setRegionOpen(false);
        setLocationMessage(`${nearest.name} als nächste verfügbare Region ausgewählt.`);
      } else {
        setLocationMessage("Kein gelisteter Standort in Ihrer Nähe. Wählen Sie eine Region manuell.");
      }
      setDetecting(false);
    }, () => { setDetecting(false); setLocationMessage("Standort nicht verfügbar. Wählen Sie eine Region manuell."); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  }

  return (
    <main className={styles.page}>
      <div className={styles.container} id="dienstleister">
        <header className={styles.directoryHeader}>
          <Link href="/" className={styles.backLink}>← Startseite</Link>
          <h1>Dienstleister entdecken</h1>
          <p>Finden Sie passende Unternehmen und filtern Sie nach Dienstleistung und Region.</p>
        </header>
        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Dienstleistungsfilter">
            <div className={styles.sidebarHeading}>Dienstleistungen</div>
            <nav className={styles.serviceNav} aria-label="Nach Dienstleistung filtern">
              {filters.map((filter) => (
                <button key={filter.id} type="button" className={`${styles.filter} ${category === filter.id ? styles.active : ""}`} aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)}>
                  <ServiceIcon type={filter.id} className={styles.filterIcon} />
                  <span>{filter.title}</span>
                </button>
              ))}
            </nav>
          </aside>
          <section className={styles.results} aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Unternehmen finden</h2>
            <div className={styles.directoryTools} role="group" aria-label="Unternehmen filtern und sortieren">
              <div className={styles.mobileCategory} ref={categoryRef}>
                <button ref={categoryButtonRef} type="button" className={styles.categoryButton} aria-label={`Dienstleistung wählen: ${filters.find((item) => item.id === category).title}`} aria-expanded={categoryOpen} aria-controls="home-category-options" onClick={() => { setCategoryOpen((open) => !open); setSortOpen(false); setRegionOpen(false); }}>
                  <ServiceIcon type={category} className={styles.categoryButtonIcon} />
                  <span>{filters.find((item) => item.id === category).title}</span>
                  <svg className={styles.categoryChevron} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" /></svg>
                </button>
                {categoryOpen && <div id="home-category-options" className={styles.categoryMenu}>
                  {filters.map((filter) => <button key={filter.id} type="button" className={`${styles.categoryOption} ${category === filter.id ? styles.categorySelected : ""}`} aria-pressed={category === filter.id} onClick={() => { setCategory(filter.id); setCategoryOpen(false); categoryButtonRef.current?.focus(); }}>
                    <ServiceIcon type={filter.id} className={styles.categoryOptionIcon} />
                    <span><strong>{filter.title}</strong><small>{filter.id === "all" ? "Alle Unternehmen" : `${allCompanies.filter((company) => company.categoryId === filter.id).length} Unternehmen`}</small></span>
                    {category === filter.id && <svg className={styles.categoryCheck} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" /></svg>}
                  </button>)}
                </div>}
              </div>
              <div className={styles.sortWrap} ref={sortRef}>
                <button ref={sortButtonRef} type="button" className={styles.sortBox} aria-label={`Unternehmen sortieren: ${sortOptions.find((item) => item.value === sortBy).label}`} aria-expanded={sortOpen} aria-controls="home-sort-options" onClick={() => { setSortOpen((open) => !open); setRegionOpen(false); setCategoryOpen(false); }}>
                  <span className={styles.sortLabel}>Sortieren</span>
                  <span className={styles.sortValue}>{sortOptions.find((item) => item.value === sortBy).label}</span>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" /></svg>
                </button>
                {sortOpen && <div id="home-sort-options" className={styles.sortMenu}>
                  {sortOptions.map((item) => <button key={item.value} type="button" className={`${styles.sortOption} ${sortBy === item.value ? styles.sortSelected : ""}`} aria-pressed={sortBy === item.value} onClick={() => { setSortBy(item.value); setSortOpen(false); sortButtonRef.current?.focus(); }}><span><strong>{item.label}</strong><small>{item.detail}</small></span>{sortBy === item.value && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" /></svg>}</button>)}
                </div>}
              </div>
              <div className={styles.regionWrap} ref={regionRef}>
                <button ref={regionButtonRef} type="button" className={styles.regionButton} aria-expanded={regionOpen} aria-controls="home-region-options" onClick={() => { setRegionOpen((open) => !open); setSortOpen(false); setCategoryOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>
                  <span>{region || "Region wählen"}</span>
                </button>
                {regionOpen && <div id="home-region-options" className={styles.regionMenu}>
                  <div className={styles.regionMenuHeading}><strong>Wählen Sie Ihre Region</strong><small>Nur Unternehmen aus dieser Region anzeigen.</small></div>
                  <button type="button" className={styles.detectButton} onClick={detectLocation} disabled={detecting}>{detecting ? "Standort wird ermittelt…" : "Standort erkennen"}</button>
                  <label className={styles.areaSearch}><span className="sr-only">Region suchen</span><input type="search" value={areaQuery} onChange={(event) => setAreaQuery(event.target.value)} placeholder="Stadt suchen" autoFocus /></label>
                  <div className={styles.areaList}>{regions.filter((item) => normalize(item.name).includes(normalize(areaQuery))).map((item) => <button key={item.name} type="button" className={styles.regionOption} aria-pressed={region === item.name} onClick={() => { setRegion(item.name); setRegionOpen(false); setAreaQuery(""); setLocationMessage(""); }}>{item.name}{region === item.name && <span aria-hidden="true">✓</span>}</button>)}{!regions.some((item) => normalize(item.name).includes(normalize(areaQuery))) && <p className={styles.locationMessage}>Keine Regionen gefunden</p>}</div>
                  {region && <button type="button" className={styles.clearRegion} onClick={() => { setRegion(""); setRegionOpen(false); setLocationMessage(""); }}>Alle Regionen anzeigen</button>}
                  {locationMessage && <p className={styles.locationMessage}>{locationMessage}</p>}
                </div>}
              </div>
            </div>
            {locationMessage && !regionOpen && <p className={styles.locationMessage} role="status">{locationMessage}</p>}
            <p className="sr-only" aria-live="polite">{companies.length} Unternehmen gefunden</p>
            {companiesLoading ? <p role="status">Unternehmen werden geladen…</p> : companies.length ? <div className={styles.grid}>
              {companies.map((company) => (
                <Link key={company.id} href={`/services/${company.categoryId}/${company.id}`} className={styles.card}>
                  <div className={styles.art}><CompanyLogo company={company} sizes="(max-width: 599px) 90vw, (max-width: 999px) 42vw, 260px" className={styles.artLogo} /></div>
                  <div className={styles.cardBody}>
                    {category === "all" && <span className={styles.category}>{labels[company.categoryId] ?? company.categoryId}</span>}
                    <h3>{company.name}</h3>
                    <span className={styles.location}>{company.address}</span>
                    <p>{company.shortDesc}</p>
                    <span className={styles.cardFoot}>Unternehmen ansehen <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              ))}
            </div> : <div className={styles.emptyState}><strong>Keine Unternehmen gefunden</strong><p>Wählen Sie eine andere Region oder Dienstleistung.</p><button type="button" onClick={() => { setRegion(""); setCategory("all"); }}>Filter zurücksetzen</button></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
