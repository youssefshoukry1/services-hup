import Link from "next/link";
import StepIllustration from "./StepIllustration";
import BenefitsStrip from "./BenefitsStrip";
import PromotionIcon from "./PromotionIcon";
import styles from "./home-promotions.module.css";

const benefits = [
  { title: "Für Ihr Zuhause", description: "Malerarbeiten & Reinigung", mobileTitle: "Zuhause", mobileDescription: "Malen & Reinigen" },
  { title: "Für Ihr Auto", description: "Autoreparatur in Ihrer Region", mobileTitle: "Auto", mobileDescription: "Autoreparatur" },
  { title: "Direkt erreichbar", description: "Unternehmen per Telefon & E-Mail kontaktieren", mobileTitle: "Kontakt", mobileDescription: "Telefon & E-Mail" },
];

const promotionalMessages = [
  {
    illustration: "add",
    title: "Angebot vorstellen",
    description: "Leistungen und Kontaktdaten präsentieren.",
  },
  {
    illustration: "search",
    title: "Hilfe vor Ort finden",
    description: "Passende Unternehmen in Ihrer Region.",
  },
  {
    illustration: "contact",
    title: "Direkt Kontakt aufnehmen",
    description: "Einfach per Telefon oder E-Mail.",
  },
];

const websiteActions = [
  {
    primary: true,
    illustration: "search",
    audience: "Für Suchende",
    title: "Dienstleister finden",
    description: "Entdecken Sie passende Unternehmen für Ihr Zuhause oder Ihr Auto.",
    features: ["Nach Dienstleistung und Region filtern", "Leistungen und Preise im Profil ansehen", "Direkt per Telefon oder E-Mail kontaktieren"],
    href: "/dienstleister",
    action: "Passende Hilfe finden",
  },
  {
    primary: false,
    illustration: "add",
    audience: "Für Unternehmen",
    title: "Dienstleistung anbieten",
    description: "Stellen Sie Ihr Unternehmen mit Leistungen, Preisen und Kontaktdaten vor.",
    features: ["Einfach das Eintragsformular ausfüllen", "Nach Prüfung auf ServiceHub sichtbar"],
    href: "/add-company",
    action: "Unternehmen eintragen",
  },
];

export default function HomePromotions() {
  return (
    <>
      <BenefitsStrip benefits={benefits} />

      <section className={styles.promotionSection} aria-labelledby="promotion-heading">
        <div className={`${styles.container} ${styles.promotionContainer}`}>
          <header className={styles.promotionHeading}>
            <h2 id="promotion-heading">ServiceHub verbindet.</h2>
          </header>
          <ul className={styles.promotionGrid}>
            {promotionalMessages.map((message, index) => (
              <li className={styles.promotionItem} key={message.illustration}>
                <PromotionIcon type={message.illustration} index={index} />
                <div className={styles.promotionBody}>
                  <h3>{message.title}</h3>
                  <p className={styles.promotionDescription}>{message.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.howSection} aria-labelledby="how-it-works-heading">
        <div className={styles.container}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>ServiceHub für Sie</p>
            <h2 id="how-it-works-heading">Was möchten Sie tun?</h2>
            <p className={styles.introduction}>Finden Sie Unterstützung vor Ort oder stellen Sie Ihr eigenes Angebot vor.</p>
          </header>
          <ul className={styles.actionGrid}>
            {websiteActions.map((action) => (
              <li className={`${styles.actionCard} ${action.primary ? styles.primaryCard : ""}`} key={action.illustration}>
                <div className={styles.cardHeading}>
                  <StepIllustration type={action.illustration} className={styles.illustration} />
                  <div className={styles.cardTitle}>
                    <p className={styles.audience}>{action.audience}</p>
                    <h3>{action.title}</h3>
                  </div>
                </div>
                <p className={styles.cardDescription}>{action.description}</p>
                <ul className={styles.features}>
                  {action.features.map((feature) => <li key={feature}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{feature}</span></li>)}
                </ul>
                <Link className={`${styles.featureLink} ${action.primary ? styles.primaryLink : ""}`} href={action.href}>{action.action}<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
