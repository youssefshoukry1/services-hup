import Image from "next/image";
import Link from "next/link";
import { mockData } from "../../../mockData";
import styles from "./services.module.css";

const presentation = {
  painters: {
    image: "/images/services/painting-service.webp",
    alt: "Farbroller, Farbeimer und Pinsel",
  },
  cleaning: {
    image: "/images/services/cleaning-service.webp",
    alt: "Professionelle Reinigungsgeräte",
  },
  auto_repair: {
    image: "/images/services/car-repair-service.webp",
    alt: "Auto und professionelle Werkzeuge",
  },
};

export const metadata = {
  title: "Dienstleistungen entdecken | ServiceHub",
  description: "Entdecken Sie lokale Fachbetriebe für Malerarbeiten, Reinigung und Autoreparatur.",
};

export default function DienstleistungenPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Brotkrumennavigation">
          <Link href="/">Startseite</Link>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span aria-current="page">Dienstleistungen</span>
        </nav>

        <header className={styles.hero}>
          <h1>Wobei können wir Ihnen helfen?</h1>
        </header>

        <section className={styles.grid} aria-label="Dienstleistungskategorien">
          {mockData.categories.map((category, index) => {
            const item = presentation[category.id];
            return (
              <article className={styles.card} style={{ "--delay": `${index * 110}ms` }} key={category.id}>
                <Link href={`/services/${category.id}`} aria-label={`Entdecken: ${category.title}`}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 699px) 92vw, (max-width: 1049px) 46vw, 360px"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.content}>
                    <h2>{category.title}</h2>
                    <div className={styles.action}>
                      Dienstleistung ansehen
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
