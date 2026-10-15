import Image from "next/image";
import Link from "next/link";
import styles from "./mobile-service-promotion.module.css";

export default function MobileServicePromotion() {
  return (
    <section className={styles.section} aria-labelledby="mobile-service-heading">
      <div className={styles.container}>
        <div className={styles.visual}>
          <div className={styles.imageStage}>
            <Image
              src="/images/home/service-on-your-phone.webp"
              alt="Eine Frau sitzt im Schneidersitz und wählt auf ihrem Smartphone eine Dienstleistung bei ServiceHub aus."
              width={1254}
              height={1254}
              sizes="(max-width: 479px) 44vw, (max-width: 699px) 190px, (max-width: 999px) 46vw, 520px"
              className={styles.image}
            />
          </div>
        </div>
        <div className={styles.copy}>
          <div className={styles.headline}>
            <p className={styles.eyebrow}>Einfach von überall</p>
            <h2 id="mobile-service-heading">
              <span className={styles.desktopCopy}>Ihr nächster Service.</span>
              <span className={styles.mobileCopy}>Ihr Service.</span>
              <span className={styles.accent}>
                <span className={styles.desktopCopy}>Nur ein paar Klicks entfernt.</span>
                <span className={styles.mobileCopy}>Einfach per Handy.</span>
              </span>
            </h2>
          </div>
          <p className={styles.description}>
            <span className={styles.desktopCopy}>
              Ob Malerarbeiten, Reinigung oder Autoreparatur: Finden Sie die Hilfe,
              die Sie brauchen, direkt auf Ihrem Handy. Entdecken Sie Dienstleister
              in Ihrer Nähe und nehmen Sie einfach Kontakt auf.
            </span>
            <span className={styles.mobileCopy}>
              Passende Profis in Ihrer Nähe finden und direkt Kontakt aufnehmen.
            </span>
          </p>
          <Link href="/dienstleister" className={styles.cta}>
            <span className={styles.desktopCopy}>Alle Dienstleistungen ansehen</span>
            <span className={styles.mobileCopy}>Services ansehen</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
