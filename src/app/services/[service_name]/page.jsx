import Link from "next/link";
import { notFound } from "next/navigation";
import { mockData } from "../../../../mockData";
import { getApprovedCompanies } from "../../../lib/api";
import CompanyDirectory from "./CompanyDirectory";
import styles from "./service-page.module.css";

const categoryDetails = {
  painters: {
    eyebrow: "Malerbetriebe",
    description: "Erfahrene Malerbetriebe für Innenräume, Fassaden und dekorative Oberflächen.",
    icon: "paint",
  },
  cleaning: {
    eyebrow: "Reinigungsbetriebe",
    description: "Finden Sie zuverlässige Reinigungsteams für Wohnungen, Büros, Fenster und Grundreinigungen.",
    icon: "sparkles",
  },
  auto_repair: {
    eyebrow: "Kfz-Fachbetriebe",
    description: "Finden Sie Werkstätten vor Ort für Wartung, Diagnose, Reifen, Karosserie und Reparaturen.",
    icon: "car",
  },
};

export const dynamic = "force-dynamic";

async function getServiceData(serviceName) {
  const category = mockData.categories.find((item) => item.id === serviceName);
  if (!category) return null;

  return {
    category,
    companies: await getApprovedCompanies(category.id),
    details: categoryDetails[category.id],
  };
}

function CategoryIcon({ type }) {
  if (type === "paint") {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 5 4-4 4 4-4 4m-8.2 4.6 5.6-5.6 2.8 2.8-5.6 5.6m-2.8-2.8-5.7 5.7a2 2 0 0 0 2.8 2.8l5.7-5.7" />
    );
  }

  if (type === "car") {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17v2m14-2v2M4 13l2-6h12l2 6m-15 4h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2Zm2-4h.01M17 13h.01" />
    );
  }

  return (
    <path strokeLinecap="round" strokeLinejoin="round" d="m12 2 1.3 4.7L18 8l-4.7 1.3L12 14l-1.3-4.7L6 8l4.7-1.3L12 2Zm7 12 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 13l.9 3.1L9 17l-3.1.9L5 21l-.9-3.1L1 17l3.1-.9L5 13Z" />
  );
}

export async function generateMetadata({ params }) {
  const { service_name: serviceName } = await params;
  const service = await getServiceData(serviceName);

  if (!service) {
    return { title: "Dienstleistung nicht gefunden | ServiceHub" };
  }

  return {
    title: `${service.category.title} | ServiceHub`,
    description: service.details.description,
  };
}

export default async function ServicePage({ params }) {
  const { service_name: serviceName } = await params;
  const service = await getServiceData(serviceName);

  if (!service) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Brotkrumennavigation">
          <Link href="/">Startseite</Link>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span aria-current="page">{service.category.title}</span>
        </nav>


        <CompanyDirectory
          companies={service.companies}
        />

        <section className={styles.valueSection} aria-label="Vorteile der Dienstleistungssuche">


          <div className={styles.features}>
            <article>
              <h3>Angebote vor Ort</h3>
            </article>
            <article>
              <h3>Übersichtliche Preise</h3>
            </article>
            <article>
              <h3>Direkter Kontakt</h3>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
