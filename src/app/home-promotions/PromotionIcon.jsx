import StepIllustration from "./StepIllustration";
import styles from "./home-promotions.module.css";

export default function PromotionIcon({ type }) {
  return (
    <span className={styles.iconReveal} aria-hidden="true">
      <StepIllustration type={type} className={styles.promotionIcon} />
    </span>
  );
}
