import Image from "next/image";
import Link from "next/link";
import styles from "./mobile-service-promotion.module.css";

const thoughts = [
  { text: "Ich habe keine Zeit.", mobileText: "Keine Zeit" },
  { text: "Ich brauche Profis.", mobileText: "Profis nötig" },
  { text: "Es muss schnell gehen.", mobileText: "Schnelle Hilfe" },
];

export default function TimeSavingPromotion() {
  return (
    <section className={`${styles.section} ${styles.timeSection}`} aria-labelledby="time-saving-heading">
      <div className={styles.container}>
        <div className={styles.copy}>
          <div className={styles.headline}>
            <h2 id="time-saving-heading">
              Keine Zeit?
              <span className={styles.accent}>
                <span className={styles.desktopCopy}>Überlassen Sie es den Profis.</span>
                <span className={styles.mobileCopy}>Profis helfen weiter.</span>
              </span>
            </h2>
          </div>
          <p className={styles.description}>
            <span className={styles.desktopCopy}>
              Wählen Sie einfach den Service, den Sie brauchen. Finden Sie passende
              Profis für Malerarbeiten, Reinigung oder Autoreparatur, die Ihnen die
              Arbeit abnehmen. So bleibt mehr Zeit für das, was Ihnen wichtig ist.
            </span>
            <span className={styles.mobileCopy}>
              <bdi>Service auswählen.</bdi><br />
              <bdi>Mehr Zeit für Sie.</bdi>
            </span>
          </p>
          <Link href="/dienstleister" className={styles.cta}>
            <span className={styles.desktopCopy}>Jetzt Dienstleister finden</span>
            <span className={styles.mobileCopy}>Profis finden</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div className={`${styles.visual} ${styles.thinkingVisual}`}>
          <ul className={styles.thoughts} aria-label="Gedanken bei wenig Zeit">
            {thoughts.map((thought, index) => (
              <li className={styles.thought} key={thought.text}>
                <span className={styles.desktopCopy}>{thought.text}</span>
                <span className={styles.mobileCopy}>{thought.mobileText}</span>
                {index === thoughts.length - 1 && <span className={styles.thirdThoughtDot} aria-hidden="true" />}
              </li>
            ))}
          </ul>
          <div className={styles.imageStage}>
            <Image
              src="/images/home/no-time-for-repairs.webp"
              alt="Ein Mann sitzt im Schneidersitz, legt einen Finger an seine Schläfe und denkt über die Arbeit nach, für die ihm die Zeit fehlt."
              width={1254}
              height={1254}
              sizes="(max-width: 479px) 44vw, (max-width: 699px) 190px, (max-width: 999px) 46vw, 520px"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
