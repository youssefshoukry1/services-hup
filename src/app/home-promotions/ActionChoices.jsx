import Link from "next/link";
import styles from "./action-choices.module.css";

const steps = [
  { title: "Suchen", description: "Dienstleistung und Ort wählen." },
  { title: "Vergleichen", description: "Leistungen und Preise ansehen." },
  { title: "Kontakt aufnehmen", description: "Direkt anrufen oder eine E-Mail senden." },
];

function Arrow() {
  return <svg className={styles.arrow} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ActionChoices() {
  return <section className={styles.section} aria-labelledby="how-it-works-heading" data-scroll-blur="">
    <div className={styles.container}>
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="how-it-works-heading">In drei Schritten<br /><em>zum passenden Profi.</em></h2>
          <Link className={styles.primaryLink} href="/dienstleister">Dienstleister entdecken <Arrow /></Link>
        </header>
        <ol className={styles.steps} aria-label="In drei Schritten zur passenden Hilfe">
          {steps.map((step, index) => <li className={styles.step} key={step.title} data-action-step="">
            <span className={styles.stepTrigger} data-step-divider="" aria-hidden="true" />
            <div className={styles.stepContent} data-step-content="">
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
            </div>
          </li>)}
        </ol>
      </div>
      <aside className={styles.business} aria-labelledby="business-invitation-heading">
        <span className={styles.businessLabel}>Für Unternehmen</span>
        <div className={styles.businessCopy}><h3 id="business-invitation-heading">Neue Kunden erreichen</h3><p>Leistungen und Kontaktdaten präsentieren.</p></div>
        <Link className={styles.businessLink} href="/add-company">Unternehmen eintragen <Arrow /></Link>
      </aside>
    </div>
  </section>;
}
