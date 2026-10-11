"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./company-detail.module.css";

export default function ServiceGallery({ images }) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef(null);

  function open(index) {
    setActive(index);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function move(direction) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  return (
    <section className={styles.gallerySection} aria-labelledby="gallery-heading">
      <div className={styles.galleryHeading}>
        <h2 id="gallery-heading">Einblicke in die Arbeit</h2>
        <p>Beispielbilder der Dienstleistung, keine Aufnahmen dieses Unternehmens.</p>
      </div>
      <div className={styles.galleryGrid}>
        {images.map((item, index) => (
          <button key={item.src} type="button" className={styles.galleryTile} onClick={() => open(index)} aria-label={`${item.alt} – Bild ${index + 1} von ${images.length} vergrößern`}>
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 599px) 45vw, (max-width: 849px) 44vw, 340px" className={styles.galleryImage} />
            <span className={styles.galleryZoom} aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className={styles.galleryDialog} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }} onClick={(event) => { if (event.target === dialogRef.current) close(); }} aria-label="Dienstleistungsbilder">
        <div className={styles.dialogInner}>
          <div className={styles.dialogTop}><span>{active + 1} / {images.length}</span><button type="button" onClick={close} aria-label="Bildansicht schließen">✕</button></div>
          <div className={styles.dialogImage}><Image src={images[active].src} alt={images[active].alt} fill sizes="min(90vw, 1000px)" className={styles.galleryImage} /></div>
          <div className={styles.dialogBottom}>
            <button type="button" onClick={() => move(-1)} aria-label="Vorheriges Bild">←</button>
            <p>{images[active].alt}</p>
            <button type="button" onClick={() => move(1)} aria-label="Nächstes Bild">→</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
