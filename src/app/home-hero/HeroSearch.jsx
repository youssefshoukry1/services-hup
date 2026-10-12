"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getApprovedCompanies } from "../../lib/api";
import { searchCompanies } from "../../lib/company-search";
import CompanyLogo from "../CompanyLogo";
import ServiceIcon from "../ServiceIcon";
import styles from "./hero-search.module.css";

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" strokeLinecap="round" /></svg>;
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const hasQuery = Boolean(query.trim());
  const results = useMemo(() => searchCompanies(query, companies), [query, companies]);
  const count = results.categories.length + results.companies.length;

  useEffect(() => {
    let active = true;
    getApprovedCompanies().then((items) => { if (active) setCompanies(items); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => { if (!wrapRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function handleKeyDown(event) {
    if (event.key === "Escape") { inputRef.current?.focus(); setOpen(false); }
    if (event.key === "ArrowDown") {
      const links = [...wrapRef.current.querySelectorAll('[data-search-result]')];
      const current = links.indexOf(document.activeElement);
      if (links.length) { event.preventDefault(); links[Math.min(current + 1, links.length - 1)].focus(); }
    }
    if (event.key === "ArrowUp") {
      const links = [...wrapRef.current.querySelectorAll('[data-search-result]')];
      const current = links.indexOf(document.activeElement);
      if (current >= 0) { event.preventDefault(); if (current === 0) inputRef.current?.focus(); else links[current - 1].focus(); }
    }
  }

  return (
    <div ref={wrapRef} className={styles.wrap} onKeyDown={handleKeyDown} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <label className={styles.searchLabel} htmlFor="hero-search-input">Was suchen Sie?</label>
      <form role="search" aria-label="Dienstleister suchen" className={styles.form} onSubmit={(event) => { event.preventDefault(); setOpen(hasQuery); inputRef.current?.focus(); }}>
        <div className={styles.field}>
          <SearchIcon />
          <input id="hero-search-input" ref={inputRef} type="search" autoComplete="off" enterKeyHint="search" placeholder="z. B. Malerarbeiten" aria-describedby="hero-search-hint" value={query} aria-controls={open && hasQuery ? "hero-search-results" : undefined} onChange={(event) => { setQuery(event.target.value); setOpen(Boolean(event.target.value.trim())); }} onFocus={() => { if (hasQuery) setOpen(true); }} />
        </div>
        <button type="submit" className={styles.submit} aria-label="Suchen"><SearchIcon /><span>Suchen</span></button>
      </form>
      <p id="hero-search-hint" className={styles.searchHint}>Dienstleistung, Unternehmen oder Ort eingeben.</p>
      {open && hasQuery && (
        <div id="hero-search-results" className={styles.results} role="region" aria-label="Suchergebnisse">
          <p className={styles.heading} role="status">{loading ? "Unternehmen werden geladen…" : `${count} Treffer`}</p>
          {results.categories.map((category) => <Link data-search-result key={category.id} href={`/services/${category.id}`} className={styles.result} onClick={() => setOpen(false)}>
            <span className={styles.icon}><ServiceIcon type={category.id} /></span>
            <span className={styles.text}><strong>{category.title}</strong><small>Dienstleistung</small></span>
            <span aria-hidden="true">↗</span>
          </Link>)}
          {results.companies.slice(0, 6).map((company) => <Link data-search-result key={company.id} href={`/services/${company.categoryId}/${company.id}`} className={styles.result} onClick={() => setOpen(false)}>
            <span className={styles.logo}><CompanyLogo company={company} sizes="40px" /></span>
            <span className={styles.text}><strong>{company.name}</strong><small>{company.address}</small></span>
            <span aria-hidden="true">↗</span>
          </Link>)}
          {results.companies.length > 6 && <p className={styles.message}>6 von {results.companies.length} Unternehmen. Suche nach Ort oder Name verfeinern.</p>}
          {failed && <p className={styles.message} role="status">Unternehmen nicht verfügbar. Dienstleistungssuche ist möglich.</p>}
          {!loading && !failed && !count && <div className={styles.empty}><strong>Keine Treffer</strong><p>Anderen Suchbegriff versuchen.</p></div>}
        </div>
      )}
    </div>
  );
}
