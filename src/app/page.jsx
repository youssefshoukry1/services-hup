import HomeHero from "./home-hero/HomeHero";
import HomePromotions from "./home-promotions/HomePromotions";
import HomeScrollTransition from "./home-hero/HomeScrollTransition";
import MobileServicePromotion from "./home-promotions/MobileServicePromotion";
import TimeSavingPromotion from "./home-promotions/TimeSavingPromotion";
import ContactSection from "./contact/ContactSection";

export default function Home() {
  return (
    <main>
      <HomeScrollTransition hero={<HomeHero />}>
        <HomePromotions />
      </HomeScrollTransition>
      <MobileServicePromotion />
      <TimeSavingPromotion />
      <ContactSection />
    </main>
  );
}
