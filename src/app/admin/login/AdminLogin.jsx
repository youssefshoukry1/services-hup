"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiBase } from "../../../lib/api";
import styles from "../admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Anmeldung fehlgeschlagen.");
      router.push("/admin/submissions");
    } catch (cause) {
      setError(cause.message || "Anmeldung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return <main className={styles.page}>
    <div className={styles.loginCard}>
      <Link href="/" className={styles.brand}>Service<span>Hub</span></Link>
      <p className={styles.eyebrow}>Administration</p>
      <h1>Anmelden</h1>
      <p>Unternehmenseinträge prüfen und freigeben.</p>
      <form onSubmit={submit}>
        <label>E-Mail-Adresse<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Passwort<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Anmeldung läuft…" : "Anmelden"}</button>
      </form>
    </div>
  </main>;
}
