import Link from "next/link";
import ServiceIcon from "../ServiceIcon";
import styles from "./service-promotion.module.css";

const services = [
  { id: "painters", title: "Malerarbeiten", description: "Frische Farbe für Ihr Zuhause." },
  { id: "cleaning", title: "Reinigung", description: "Mehr Zeit. Ein sauberes Zuhause." },
  { id: "auto_repair", title: "Autoreparatur", description: "Hilfe für Ihr Auto vor Ort." },
];

export default function ServicePromotion() {
  return (
    <section className={styles.section} aria-labelledby="service-promotion-heading">
      <div className={styles.container}>
        <h2 id="service-promotion-heading" data-promotion-heading="">Wobei brauchen Sie Hilfe?</h2>
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.id} data-promotion-item="">
              <Link href={`/services/${service.id}`} className={styles.card}>
                <span className={styles.icon}><ServiceIcon type={service.id} /></span>
                <div className={styles.copy}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className={styles.action}>Entdecken
                  <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
