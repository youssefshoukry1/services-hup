"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { mountTireReveal } from "./tire-reveal";
import styles from "./service-promotion.module.css";

export default function TireHeadline() {
  const headlineRef = useRef(null);

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    const section = headline?.closest("[data-service-promotion]");
    if (section) return mountTireReveal(section, headline);
  }, []);

  return (
    <div className={styles.headline} ref={headlineRef}>
      <h2 id="service-promotion-heading">Wobei brauchen Sie Hilfe?</h2>
      <span className={styles.tireTrack} aria-hidden="true" data-tire-track="">
        <span className={styles.tire} data-tire="">
          <Image src="/images/home/tire.webp" alt="" width={480} height={480}
            loading="eager"
            sizes="(max-width: 575px) 80px, (max-width: 1024px) 104px, 128px" />
        </span>
      </span>
    </div>
  );
}
