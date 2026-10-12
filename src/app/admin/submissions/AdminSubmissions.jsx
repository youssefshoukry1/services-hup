"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiBase } from "../../../lib/api";
import CompanyLogo from "../../CompanyLogo";
import styles from "../admin.module.css";

const tabs = [
  { id: "pending", label: "Ausstehend" },
  { id: "approved", label: "Freigegeben" },
  { id: "rejected", label: "Abgelehnt" },
];

export default function AdminSubmissions() {
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const load = useCallback(async (selectedStatus) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/admin/companies?status=${selectedStatus}`, { credentials: "include", cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) throw new Error("Einträge konnten nicht geladen werden.");
      setCompanies(await response.json());
    } catch (cause) {
      setError(cause.message || "Einträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetch(`${apiBase}/api/admin/me`, { credentials: "include" }).then((response) => response.ok ? response.json() : null).then((data) => { if (data) setAdminEmail(data.email); });
    load(status);
  }, [load, status]);

  async function decide(company, decision) {
    setBusyId(company.id);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/admin/companies/${encodeURIComponent(company.id)}/${decision}`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reasons[company.id] || "" }),
      });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Entscheidung konnte nicht gespeichert werden.");
      setCompanies((current) => current.filter((item) => item.id !== company.id));
    } catch (cause) {
      setError(cause.message || "Entscheidung konnte nicht gespeichert werden.");
    } finally {
      setBusyId("");
    }
  }

  async function logout() {
    await fetch(`${apiBase}/api/admin/logout`, { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  }

  return <main className={styles.page}>
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div><Link href="/" className={styles.brand}>Service<span>Hub</span></Link><p className={styles.eyebrow}>Administration</p><h1>Unternehmen prüfen</h1><p>Veröffentlichung erst nach Freigabe.</p></div>
        <div className={styles.account}><span>{adminEmail}</span><button type="button" onClick={logout}>Abmelden</button></div>
      </header>
      <nav className={styles.tabs} aria-label="Status filtern">
        {tabs.map((tab) => <button key={tab.id} type="button" aria-pressed={status === tab.id} onClick={() => setStatus(tab.id)}>{tab.label}</button>)}
      </nav>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {loading ? <p role="status">Einträge werden geladen…</p> : companies.length === 0 ? <div className={styles.empty}>Keine Einträge in dieser Ansicht.</div> : <div className={styles.list}>
        {companies.map((company) => <article key={company.id} className={styles.company}>
          <div className={styles.companyTop}>
            <div className={styles.logo}><CompanyLogo company={company} sizes="64px" /></div>
            <div><span className={styles.category}>{company.categoryId.replaceAll("_", " ")}</span><h2>{company.name}</h2><p>{company.shortDesc}</p></div>
          </div>
          <dl className={styles.details}>
            <div><dt>Adresse</dt><dd>{company.address}</dd></div>
            <div><dt>Telefon</dt><dd>{company.phone}</dd></div>
            <div><dt>E-Mail</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
            {company.website && <div><dt>Webseite</dt><dd><a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></dd></div>}
            <div><dt>Eingereicht</dt><dd>{company.submittedAt ? new Date(company.submittedAt).toLocaleString("de-DE") : "Bestehender Eintrag"}</dd></div>
          </dl>
          <h3>Leistungen und Preise</h3>
          <ul className={styles.prices}>{company.prices.map((item, index) => <li key={`${item.service}-${index}`}><span>{item.service}</span><strong>{item.price}</strong></li>)}</ul>
          {status === "pending" ? <div className={styles.review}>
            <label htmlFor={`reason-${company.id}`}>Grund für eine Ablehnung (optional)</label>
            <textarea id={`reason-${company.id}`} maxLength={500} value={reasons[company.id] || ""} onChange={(event) => setReasons((current) => ({ ...current, [company.id]: event.target.value }))} />
            <div className={styles.actions}><button type="button" className={styles.reject} disabled={Boolean(busyId)} onClick={() => decide(company, "reject")}>Ablehnen</button><button type="button" className={styles.approve} disabled={Boolean(busyId)} onClick={() => decide(company, "approve")}>{busyId === company.id ? "Wird gespeichert…" : "Freigeben"}</button></div>
          </div> : <p className={styles.reviewed}>{company.reviewedAt ? `Geprüft am ${new Date(company.reviewedAt).toLocaleString("de-DE")}` : "Bestehender Eintrag"}{company.rejectionReason ? ` · Grund: ${company.rejectionReason}` : ""}</p>}
        </article>)}
      </div>}
    </div>
  </main>;
}
