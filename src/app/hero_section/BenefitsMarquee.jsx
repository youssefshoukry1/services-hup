import styles from "./benefits-marquee.module.css";

const benefits = [
  { title: "Schnell Hilfe finden", icon: "spark" },
  { title: "Professionelle Betriebe", icon: "badge" },
  { title: "Lokale Dienstleistungen", icon: "pin" },
  { title: "Übersichtliche Preise", icon: "price" },
  { title: "Direkt Kontakt aufnehmen", icon: "phone" },
  { title: "Kostenlos suchen", icon: "heart" },
];

function BenefitIcon({ type }) {
  const paths = {
    spark: <path d="m13 2-8 11h6l-1 9 9-12h-6l0-8Z" />,
    badge: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    price: <><path d="M3 7V4h12l6 6-9 9-9-9V7Z" /><circle cx="7.5" cy="7.5" r="1" /></>,
    phone: <path d="M7 3H4a2 2 0 0 0-2 2c0 9.4 7.6 17 17 17a2 2 0 0 0 2-2v-3l-4.5-1.5-1.8 2.1a14 14 0 0 1-8.3-8.3l2.1-1.8L7 3Z" />,
    heart: <path d="M20.8 8.5c0 4.5-8.8 10.5-8.8 10.5S3.2 13 3.2 8.5a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

export default function BenefitsMarquee() {
  return (
    <div className={styles.wrap} aria-label="Vorteile von ServiceHub">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div className={styles.group} key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
              {benefits.map((benefit) => (
                <div className={styles.card} key={benefit.title}>
                  <span className={styles.icon}><BenefitIcon type={benefit.icon} /></span>
                  <span>{benefit.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
