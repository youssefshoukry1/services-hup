import Link from "next/link";
import StepIllustration from "./StepIllustration";
import styles from "./home-promotions.module.css";

const benefits = [
  { title: "Für Ihr Zuhause", description: "Malerarbeiten & Reinigung" },
  { title: "Für Ihr Auto", description: "Autoreparatur in Ihrer Region" },
  { title: "Direkt erreichbar", description: "Unternehmen per Telefon & E-Mail kontaktieren" },
];

const websiteActions = [
  {
    illustration: "add",
    audience: "Für Unternehmen",
    title: "Eigene Dienstleistung eintragen",
    description: "Stellen Sie Ihr Unternehmen mit Leistungen, Preisen und Kontaktdaten vor. Reichen Sie Ihren Eintrag über das Formular zur Prüfung ein.",
    href: "/add-company",
    action: "Dienstleistung eintragen",
  },
  {
    illustration: "search",
    audience: "Für Suchende",
    title: "Passende Dienstleistung finden",
    description: "Suchen Sie auf der Website nach Malerarbeiten, Reinigung oder Autoreparatur. Entdecken Sie Unternehmen und filtern Sie nach Ihrer Region.",
    href: "/dienstleister",
    action: "Dienstleistungen suchen",
  },
  {
    illustration: "contact",
    audience: "Im direkten Austausch",
    title: "Unternehmen direkt kontaktieren",
    description: "Öffnen Sie ein Unternehmensprofil und nutzen Sie die Telefonnummer oder E-Mail-Adresse. Leistungen und Termine klären Sie direkt mit dem Anbieter.",
    href: "/dienstleister",
    action: "Unternehmen ansehen",
  },
];

export default function HomePromotions() {
  return (
    <>
      <section className={styles.benefitsSection} aria-label="Was Sie mit ServiceHub entdecken können">
        <dl className={styles.benefits}>
          {benefits.map((benefit) => (
            <div className={styles.benefit} key={benefit.title}>
              <dt>{benefit.title}</dt>
              <dd>{benefit.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.howSection} aria-labelledby="how-it-works-heading">
        <div className={styles.container}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Ihre Möglichkeiten auf ServiceHub</p>
            <h2 id="how-it-works-heading">Dienstleistungen anbieten.<br />Passende Hilfe finden.</h2>
            <p className={styles.introduction}>Entdecken Sie Angebote in Ihrer Region oder stellen Sie Ihr eigenes Unternehmen vor – direkt auf unserer Website.</p>
          </header>
          <ul className={styles.steps}>
            {websiteActions.map((step) => (
              <li className={styles.step} key={step.illustration}>
                <StepIllustration type={step.illustration} className={styles.illustration} />
                <p className={styles.stepNumber}>{step.audience}</p>
                <h3>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                <Link className={styles.featureLink} href={step.href}>{step.action}<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
