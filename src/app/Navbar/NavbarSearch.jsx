"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { mockData } from "../../../mockData";
import { getApprovedCompanies } from "../../lib/api";
import CompanyLogo from "../CompanyLogo";
import styles from "./navbar-search.module.css";

const normalize = (value) => value.trim().toLocaleLowerCase("de-DE")
  .replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "ss");

function getErgebnisse(search, location, allCompanies) {
  const term = normalize(search);
  const area = normalize(location);
  if (!term && !area) return { categories: [], companies: [] };

  const categories = area ? [] : mockData.categories.filter((category) =>
    term && normalize(`${category.title} ${category.id.replaceAll("_", " ")}`).includes(term),
  );

  const companies = allCompanies
    .filter((company) => {
      const category = mockData.categories.find((item) => item.id === company.categoryId);
      const searchable = normalize([company.name, company.shortDesc, category?.title, ...company.prices.map((item) => item.service)].join(" "));
      return (!term || searchable.includes(term)) && (!area || normalize(company.address).includes(area));
    })
    .sort((a, b) => {
      const score = (company) => (normalize(company.name).startsWith(term) ? 2 : normalize(company.name).includes(term) ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name, "de-DE");
    });

  return { categories, companies };
}

function SuchenIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4" /></svg>;
}

export default function NavbarSuchen({ isScrolled }) {
  const [allCompanies, setAllCompanies] = useState([]);
  const [search, setSuchen] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState({ search: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [resultsOpen, setErgebnisseOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    getApprovedCompanies().then((items) => { if (active) setAllCompanies(items); }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!search.trim() && !location.trim()) return;
    const timer = window.setTimeout(() => {
      setSubmitted({ search, location });
      setLoading(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [search, location]);

  useEffect(() => {
    if (!resultsOpen && !expanded) return;
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setErgebnisseOpen(false);
        setExpanded(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setErgebnisseOpen(false);
        if (isScrolled) setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [resultsOpen, expanded, isScrolled]);

  useEffect(() => {
    if (!isScrolled) setExpanded(false);
  }, [isScrolled]);

  useEffect(() => {
    if (isScrolled && expanded) searchInputRef.current?.focus();
  }, [isScrolled, expanded]);

  const results = useMemo(() => getErgebnisse(submitted.search, submitted.location, allCompanies), [submitted, allCompanies]);
  const count = results.categories.length + results.companies.length;
  const hasQuery = Boolean(search.trim() || location.trim());

  function update(field, value) {
    if (field === "search") setSuchen(value);
    else setLocation(value);
    setLoading(Boolean((field === "search" ? value : search).trim() || (field === "location" ? value : location).trim()));
    setErgebnisseOpen(Boolean((field === "search" ? value : search).trim() || (field === "location" ? value : location).trim()));
    if (!(field === "search" ? value : search).trim() && !(field === "location" ? value : location).trim()) setSubmitted({ search: "", location: "" });
  }

  function submit(event) {
    event.preventDefault();
    if (!hasQuery) { searchInputRef.current?.focus(); return; }
    setSubmitted({ search, location });
    setLoading(false);
    setErgebnisseOpen(true);
  }

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${isScrolled ? styles.compact : ""}`}>
      {isScrolled && <button type="button" className={styles.openButton} aria-label="Suche öffnen" aria-expanded={expanded} onClick={() => { setExpanded((open) => !open); setErgebnisseOpen(false); }}><SuchenIcon /><span>Suchen</span></button>}
      {(!isScrolled || expanded) && (
        <div className={styles.panel}>
          <form role="search" className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span className="sr-only">Dienstleistung oder Unternehmen</span>
              <SuchenIcon />
              <input ref={searchInputRef} type="text" inputMode="search" autoComplete="off" value={search} onChange={(event) => update("search", event.target.value)} onFocus={() => { if (hasQuery) setErgebnisseOpen(true); }} placeholder="Dienstleistung oder Unternehmen" />
            </label>
            <label className={`${styles.field} ${styles.locationField}`}>
              <span className="sr-only">Stadt oder Region</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>
              <input type="text" autoComplete="address-level2" value={location} onChange={(event) => update("location", event.target.value)} onFocus={() => { if (hasQuery) setErgebnisseOpen(true); }} placeholder="Stadt oder Region" />
            </label>
            <button type="submit" className={styles.submit} aria-label="Dienstleistungen und Unternehmen suchen">{loading ? <span className={styles.spinner} aria-hidden="true" /> : <SuchenIcon />}<span>Suchen</span></button>
          </form>

          {resultsOpen && hasQuery && (
            <div className={styles.results} role="region" aria-label="Suchergebnisse" aria-live="polite" aria-busy={loading}>
              {loading ? <div className={styles.skeletons} role="status" aria-label="Suche läuft">{[0, 1, 2, 3].map((item) => <div key={item}><span /><span /></div>)}</div> : count ? <>
                <div className={styles.resultsHeading}><span>Ergebnisse</span><span>{count} gefunden</span></div>
                {results.categories.map((category) => <Link key={category.id} href={`/services/${category.id}`} className={styles.result} onClick={() => { setErgebnisseOpen(false); setExpanded(false); }}><span className={styles.categoryIcon}><SuchenIcon /></span><span className={styles.resultText}><strong>{category.title}</strong><small>Dienstleistungskategorie</small></span><span aria-hidden="true">↗</span></Link>)}
                {results.companies.map((company) => <Link key={company.id} href={`/services/${company.categoryId}/${company.id}`} className={styles.result} onClick={() => { setErgebnisseOpen(false); setExpanded(false); }}><span className={styles.logo}><CompanyLogo company={company} sizes="42px" /></span><span className={styles.resultText}><strong>{company.name}</strong><small>{company.address}</small></span><span aria-hidden="true">↗</span></Link>)}
              </> : <div className={styles.empty}><strong>Keine Treffer gefunden</strong><span>Versuchen Sie eine andere Dienstleistung, ein Unternehmen oder einen Ort.</span></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
