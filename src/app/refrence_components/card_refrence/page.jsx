import styles from "./card-reference.module.css";

export default function CardReference() {
  return (
    <main className={styles.page}>
      <div className={styles.parent}>
        <div className={styles.card}>
          <div className={styles.contentBox}>
            <span className={styles.cardTitle}>3D-Karte</span>
            <p className={styles.cardContent}>
              Ein Beispiel für eine interaktive Karte.
            </p>
            <span className={styles.seeMore}>Mehr ansehen</span>
          </div>
          <div className={styles.dateBox}>
            <span>Juni</span>
            <strong>29</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
