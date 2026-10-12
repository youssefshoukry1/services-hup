import BenefitsStrip from "./BenefitsStrip";
import PromotionIcon from "./PromotionIcon";
import styles from "./home-promotions.module.css";
import ActionChoices from "./ActionChoices";

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

export default function HomePromotions() {
  return (
    <>
      <BenefitsStrip benefits={benefits} />

      <section className={styles.promotionSection} aria-labelledby="promotion-heading" data-scroll-blur="">
        <div className={`${styles.container} ${styles.promotionContainer}`}>
          <header className={styles.promotionHeading}>
            <h2 id="promotion-heading" data-promotion-heading="">ServiceHub verbindet.</h2>
          </header>
          <ul className={styles.promotionGrid}>
            {promotionalMessages.map((message) => (
              <li className={styles.promotionItem} key={message.illustration} data-promotion-item="">
                <PromotionIcon type={message.illustration} />
                <div className={styles.promotionBody}>
                  <h3>{message.title}</h3>
                  <p className={styles.promotionDescription}>{message.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ActionChoices />
    </>
  );
}
