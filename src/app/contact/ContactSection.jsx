"use client";

import styles from "./contact-section.module.css";

const privacyUrl = process.env.NEXT_PUBLIC_PRIVACY_URL;
const privacyHref = privacyUrl?.startsWith("https://") || privacyUrl?.startsWith("/") ? privacyUrl : null;

export default function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              <path d="M8 10h8M8 14h5" />
            </svg>
          </span>
          <p className={styles.eyebrow}>Kontakt</p>
          <h2 id="contact-heading">Lassen Sie uns <span>sprechen.</span></h2>
          <p className={styles.description}>
            Sie haben eine Frage zu ServiceHub oder möchten uns etwas mitteilen?
            Hier ist Platz für Ihr Anliegen.
          </p>
        </div>

        <form id="contact-form" className={styles.form} onSubmit={(event) => event.preventDefault()} aria-labelledby="contact-form-heading" aria-describedby="contact-preview-note">
          <div className={styles.formHeading}>
            <h3 id="contact-form-heading">Ihre Nachricht an uns</h3>
            <p>Mit <span aria-hidden="true">*</span><span className="sr-only">einem Stern</span> markierte Felder sind erforderlich.</p>
          </div>

          <div className={styles.fields}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
              <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Ihr vollständiger Name" maxLength={100} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email">E-Mail <span aria-hidden="true">*</span></label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="name@beispiel.de" maxLength={254} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-phone">Telefonnummer <span className={styles.optional}>(optional)</span></label>
              <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+49 151 12345678" maxLength={40} />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="contact-message">Nachricht <span aria-hidden="true">*</span></label>
              <textarea id="contact-message" name="message" rows={5} placeholder="Wie können wir Ihnen helfen?" maxLength={3000} required />
            </div>
          </div>

          <div className={styles.formFooter}>
            <div className={styles.consent}>
              <input id="contact-privacy" name="privacyAcknowledged" type="checkbox" required />
              <label htmlFor="contact-privacy">
                Ich habe die {privacyHref ? <a href={privacyHref} target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> : <span>Datenschutzerklärung</span>} gelesen. <span className={styles.requiredMark} aria-hidden="true">*</span>
              </label>
            </div>
            <button type="submit" className={styles.submit} disabled aria-describedby="contact-preview-note">
              Nachricht senden
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
            <p id="contact-preview-note" className={styles.previewNote}>Vorschau · Der Nachrichtenversand ist noch nicht aktiviert.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
