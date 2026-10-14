import Image from "next/image";
import BenefitsStrip from "./BenefitsStrip";
import PromotionIcon from "./PromotionIcon";
import styles from "./home-promotions.module.css";
import ActionChoices from "./ActionChoices";
import ServicePromotion from "./ServicePromotion";

const benefits = [
  { title: "Für Ihr Zuhause", description: "Malerarbeiten & Reinigung", mobileTitle: "Zuhause", mobileDescription: "Malen & Reinigen" },
  { title: "Für Ihr Auto", description: "Autoreparatur", mobileTitle: "Auto", mobileDescription: "Autoreparatur" },
  { title: "Direkter Kontakt", description: "Telefon & E-Mail", mobileTitle: "Kontakt", mobileDescription: "Telefon & E-Mail" },
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
    title: "Kontakt aufnehmen",
    description: "Einfach per Telefon oder E-Mail.",
  },
];

export default function HomePromotions() {
  return (
    <>
      <BenefitsStrip benefits={benefits} />

      <section className={styles.promotionSection} aria-labelledby="promotion-heading">
        <div className={`${styles.container} ${styles.promotionContainer}`}>
          <header className={styles.promotionHeading}>
            <h2 id="promotion-heading">
              <span className={styles.promotionTitle} data-promotion-heading="">Se<span className={styles.paintedLetter}>r</span>viceHub verbindet.</span>
            </h2>
            <Image
              className={`${styles.headingWorker} ${styles.painter}`}
              src="/images/home/workers/painter-teal.webp"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1536}
              sizes="(max-width: 699px) 100px, 120px"
            />
            <Image
              className={`${styles.headingWorker} ${styles.cleaner}`}
              src="/images/home/workers/cleaner-spray.webp"
              alt=""
              aria-hidden="true"
              width={480}
              height={720}
              sizes="(max-width: 699px) 100px, 120px"
            />
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
      <ServicePromotion />
    </>
  );
}
