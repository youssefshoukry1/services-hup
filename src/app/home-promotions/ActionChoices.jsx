import Link from "next/link";
import StepScrollReveal from "./StepScrollReveal";
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
  return <section className={styles.section} aria-labelledby="how-it-works-heading">
    <div className={styles.container}>
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="how-it-works-heading">In drei Schritten<br /><em>zum passenden Profi.</em></h2>
          <Link className={styles.primaryLink} href="/dienstleister">Dienstleister entdecken <Arrow /></Link>
        </header>
        <StepScrollReveal className={styles.steps}>
          {steps.map((step, index) => <li className={styles.step} key={step.title} data-action-step="">
            <span className={styles.stepTrigger} data-step-divider="" aria-hidden="true" />
            <div className={styles.stepContent} data-step-content="">
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
            </div>
          </li>)}
        </StepScrollReveal>
      </div>
    </div>
  </section>;
}
