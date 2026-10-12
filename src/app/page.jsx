import HomeHero from "./home-hero/HomeHero";
import HomePromotions from "./home-promotions/HomePromotions";
import HomeScrollTransition from "./home-hero/HomeScrollTransition";

export default function Home() {
  return (
    <main>
      <HomeScrollTransition hero={<HomeHero />}>
        <HomePromotions />
      </HomeScrollTransition>
    </main>
  );
}
