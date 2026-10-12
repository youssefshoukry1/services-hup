import Link from "next/link";
import styles from "./action-choices.module.css";

const steps = [
  { title: "Sagen Sie, was Sie brauchen.", description: "Wählen Sie eine Dienstleistung und Ihre Region. So finden Sie Unternehmen in Ihrer Nähe." },
  { title: "Lernen Sie die Profis kennen.", description: "Sehen Sie sich Leistungen, Preise und Unternehmensprofile an und finden Sie das passende Angebot." },
  { title: "Kommen Sie direkt ins Gespräch.", description: "Kontaktieren Sie das Unternehmen per Telefon oder E-Mail und besprechen Sie Ihr Anliegen." },
];

function Arrow() {
  return <svg className={styles.arrow} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ActionChoices() {
  return <section className={styles.section} aria-labelledby="how-it-works-heading" data-scroll-blur="">
    <div className={styles.container}>
      <div className={styles.layout}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>So funktioniert ServiceHub</p>
          <h2 id="how-it-works-heading">Passende Hilfe.<br /><em>Ganz in Ihrer Nähe.</em></h2>
          <p className={styles.description}>Ob Zuhause oder Auto: Finden Sie lokale Unternehmen und nehmen Sie direkt Kontakt auf. In drei einfachen Schritten.</p>
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
        <div className={styles.businessCopy}><h3 id="business-invitation-heading">Sie bieten Dienstleistungen an?</h3><p>Stellen Sie Ihr Unternehmen mit Leistungen und Kontaktdaten vor.</p></div>
        <Link className={styles.businessLink} href="/add-company">Unternehmen eintragen <Arrow /></Link>
      </aside>
    </div>
  </section>;
}
