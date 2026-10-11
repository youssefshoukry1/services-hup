import Link from "next/link";
import BenefitsMarquee from "./BenefitsMarquee";

const headline = "Finden Sie zuverlässige Hilfe in Ihrer Nähe.";
const popularServices = [
  { label: "Malerbetriebe", icon: "brush", href: "/services/painters" },
  { label: "Reinigung", icon: "sparkles", href: "/services/cleaning" },
  { label: "Autoreparatur", icon: "car", href: "/services/auto_repair" },
];

function ServiceIcon({ type }) {
  if (type === "brush") return <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 5.5 4-4 4 4-4 4m-12 8c-2.5.5-4 2-4 4 2 0 3.5-.5 4.5-1.5 1.8-1.8 1.7-4-.5-4.5-2.2-.5-3.2.2-4.5 2Z" />;
  if (type === "car") return <path strokeLinecap="round" strokeLinejoin="round" d="M5 17v2m14-2v2M3 13l2-6h14l2 6M5 17h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2Zm2-4h.01M17 13h.01" />;
  return <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Zm7 10 .7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13ZM5 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />;
}

export default function Hero() {
  return (
    <main className="relative isolate overflow-x-clip bg-white">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_50%_0%,rgba(0,128,128,0.12),transparent_62%)]" />
      <div aria-hidden="true" className="absolute -right-24 top-44 -z-10 size-64 rounded-full bg-teal-50/70 blur-3xl" />

      <section className="mx-auto flex min-h-[calc(100svh-10.125rem)] w-full min-w-0 max-w-6xl flex-col px-4 pb-8 pt-5 min-[900px]:min-h-[calc(100svh-4.75rem)] sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-1 flex-col justify-center">
          <div className="text-center">
            <div className="hero-rise inline-flex items-center gap-2 rounded-full border border-[#008080]/15 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#007474] shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-[#008080]" />
              Lokal. Zuverlässig. Schnell.
            </div>

            <h1 aria-label={headline} className="mx-auto mt-5 max-w-3xl text-[2rem] font-extrabold leading-[1.12] tracking-[-0.035em] text-gray-950 sm:text-6xl lg:text-7xl">
              {headline.split(" ").map((word, wordIndex, words) => {
                const letterOffset = words
                  .slice(0, wordIndex)
                  .reduce((total, previousWord) => total + previousWord.length + 1, 0);

                return (
                  <span aria-hidden="true" className="inline-block whitespace-nowrap" key={word}>
                    {word.split("").map((letter, letterIndex) => (
                      <span
                        className="hero-letter inline-block"
                        style={{ "--letter-delay": `${(letterOffset + letterIndex) * 42}ms` }}
                        key={`${letter}-${letterIndex}`}
                      >
                        {letter}
                      </span>
                    ))}
                    {wordIndex < words.length - 1 && "\u00A0"}
                  </span>
                );
              })}
            </h1>

          </div>

          <div className="hero-rise mt-7 [animation-delay:1.4s] sm:mt-10">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Beliebte Dienstleistungen</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularServices.map((service) => (
                <Link key={service.label} href={service.href} className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#008080]/30 hover:text-[#008080] hover:shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4 text-[#008080]" aria-hidden="true"><ServiceIcon type={service.icon} /></svg>
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <BenefitsMarquee />
      </section>
    </main>
  );
}
