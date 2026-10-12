"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./footer.module.css";

const socialLinks = [
  { name: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL, icon: "instagram" },
  { name: "Facebook", url: process.env.NEXT_PUBLIC_FACEBOOK_URL, icon: "facebook" },
  { name: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL, icon: "linkedin" },
].filter((item) => item.url?.startsWith("https://"));
const policyLinks = [
  { name: "Datenschutzerklärung", url: process.env.NEXT_PUBLIC_PRIVACY_URL },
  { name: "Nutzungsbedingungen", url: process.env.NEXT_PUBLIC_TERMS_URL },
].filter((item) => item.url?.startsWith("https://") || item.url?.startsWith("/"));

function SocialIcon({ type }) {
  if (type === "instagram") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  if (type === "facebook") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4v1.9H7.5V13h2.8v8h3.4Z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.1 8.2A2 2 0 1 0 5 4.3a2 2 0 0 0 .1 3.9ZM3.5 9.7h3.1V21H3.5V9.7Zm5.1 0h3v1.5c.4-.9 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5V21h-3.1v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H8.6V9.7Z" /></svg>;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setEmail("");
    setMessage("");
    setStatus("Formular geleert. Der Nachrichtenversand wird bald verfügbar sein.");
  }

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logo} aria-label="ServiceHub Startseite">Service<span>Hub</span></Link>
            {socialLinks.length > 0 && <div className={styles.socials} aria-label="ServiceHub in sozialen Medien">{socialLinks.map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name}><SocialIcon type={social.icon} /></a>)}</div>}
          </div>

          <nav className={styles.linksColumn} aria-label="Dienstleistungen im Footer">
            <h2>Dienstleistungen</h2>
            <Link href="/services/painters">Malerarbeiten</Link>
            <Link href="/services/cleaning">Reinigung</Link>
            <Link href="/services/auto_repair">Autoreparatur</Link>
          </nav>

          <nav className={styles.linksColumn} aria-label="Footernavigation">
            <h2>Entdecken</h2>
            <Link href="/">Startseite</Link>
            <Link href="/dienstleister">Unternehmen entdecken</Link>
            <a href="#contact-form">Kontakt</a>
          </nav>

          <div className={styles.contactColumn}>
            <h2>Nachricht senden</h2>
            <form id="contact-form" onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="footer-email" className="sr-only">Ihre E-Mail-Adresse</label>
              <input id="footer-email" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setStatus(""); }} placeholder="Ihre E-Mail-Adresse" />
              <label htmlFor="footer-message" className="sr-only">Ihre Nachricht</label>
              <textarea id="footer-message" required rows="3" maxLength="2000" value={message} onChange={(event) => { setMessage(event.target.value); setStatus(""); }} placeholder="Ihre Nachricht" />
              <button type="submit">Senden <span aria-hidden="true">↗</span></button>
              {status && <small role="status">{status}</small>}
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} ServiceHub. Alle Rechte vorbehalten.</span>
          <div className={styles.bottomLinks}>
            {policyLinks.map((link) => <a key={link.name} href={link.url}>{link.name}</a>)}
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Nach oben ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
