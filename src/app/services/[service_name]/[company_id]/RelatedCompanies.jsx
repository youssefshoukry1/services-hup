"use client";

import Link from "next/link";
import { useState } from "react";
import CompanyLogo from "../../../CompanyLogo";
import styles from "./company-detail.module.css";

const PAGE_SIZE = 3;

export default function RelatedCompanies({ companies, categoryId }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(companies.length / PAGE_SIZE);
  const visibleCompanies = companies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className={styles.relatedGrid}>
        {visibleCompanies.map((company) => (
          <Link
            key={company.id}
            className={styles.relatedCard}
            href={`/services/${categoryId}/${company.id}`}
          >
            <div className={styles.relatedLogo}>
              <CompanyLogo company={company} sizes="48px" className={styles.relatedLogoImage} />
            </div>
            <h3>{company.name}</h3>
            <p className={styles.relatedAddress}>{company.address}</p>
            <p className={styles.relatedDescription}>{company.shortDesc}</p>
            <span className={styles.relatedAction}>Unternehmen ansehen <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className={styles.relatedPagination} aria-label="Ähnliche Angebote durchblättern">
          <span className="sr-only" aria-live="polite">Seite {page + 1} von {pageCount}</span>
          <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 0}>
            Zurück
          </button>
          <div className={styles.relatedPages}>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                aria-label={`Seite ${index + 1}`}
                aria-current={page === index ? "page" : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page === pageCount - 1}>
            Weiter
          </button>
        </nav>
      )}
    </>
  );
}
