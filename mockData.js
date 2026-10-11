// Fiktive Beispieleinträge für die Demo. Keine realen Unternehmen oder Kontaktdaten.
export const mockData = {
  "categories": [
    {
      "id": "painters",
      "title": "Malerarbeiten & Gestaltung",
      "icon": "🖌️"
    },
    {
      "id": "cleaning",
      "title": "Reinigungsdienste",
      "icon": "🧹"
    },
    {
      "id": "auto_repair",
      "title": "Autoreparatur & Wartung",
      "icon": "🚗"
    }
  ],
  "companies": [
    {
      "id": "comp-p1",
      "categoryId": "painters",
      "name": "ColorPro Painters",
      "logo": "/images/logos/colorpro.webp",
      "image": "/images/companies/comp-p1.webp",
      "shortDesc": "Professionelle Innen- und Außenanstriche für Wohngebäude.",
      "address": "Musterstraße 12, 10115 Berlin",
      "phone": "+49 30 0000 0001",
      "email": "kontakt1@example.com",
      "website": "https://example.com/comp-p1",
      "prices": [
        {
          "service": "Innenwände streichen",
          "price": "10 € / m²"
        },
        {
          "service": "Fassade streichen",
          "price": "15 € / m²"
        },
        {
          "service": "Holz lasieren",
          "price": "8 € / m²"
        }
      ]
    },
    {
      "id": "comp-p2",
      "categoryId": "painters",
      "name": "Brush & Roll Studio",
      "logo": "/images/logos/brushroll.webp",
      "image": "/images/companies/comp-p2.webp",
      "shortDesc": "Dekorative Anstriche und hochwertige Tapetenarbeiten.",
      "address": "Beispielweg 45, 20095 Hamburg",
      "phone": "+49 40 0000 0002",
      "email": "kontakt2@example.com",
      "website": "https://example.com/comp-p2",
      "prices": [
        {
          "service": "Dekorative Wandgestaltung",
          "price": "20 € / m²"
        },
        {
          "service": "Tapeten anbringen",
          "price": "12 € / Rolle"
        }
      ]
    },
    {
      "id": "comp-p3",
      "categoryId": "painters",
      "name": "Elite Wall Coatings",
      "logo": "/images/logos/elitewalls.webp",
      "image": "/images/companies/comp-p3.webp",
      "shortDesc": "Beschichtungen für Gewerbe- und Industrieflächen.",
      "address": "Musterallee 78, 80331 München",
      "phone": "+49 89 0000 0003",
      "email": "kontakt3@example.com",
      "website": "https://example.com/comp-p3",
      "prices": [
        {
          "service": "Büroräume streichen",
          "price": "12 € / m²"
        },
        {
          "service": "Industrieboden beschichten",
          "price": "25 € / m²"
        }
      ]
    },
    {
      "id": "comp-p4",
      "categoryId": "painters",
      "name": "QuickCoat Services",
      "logo": "/images/logos/quickcoat.webp",
      "image": "/images/companies/comp-p4.webp",
      "shortDesc": "Schnelle und zuverlässige Malerarbeiten für den Einzug.",
      "address": "Beispielstraße 90, 50667 Köln",
      "phone": "+49 221 0000 0004",
      "email": "kontakt4@example.com",
      "website": "https://example.com/comp-p4",
      "prices": [
        {
          "service": "Wände neu streichen",
          "price": "7 € / m²"
        },
        {
          "service": "Decken streichen",
          "price": "9 € / m²"
        }
      ]
    },
    {
      "id": "comp-p5",
      "categoryId": "painters",
      "name": "Artistic Finishes",
      "logo": "/images/logos/artistic.webp",
      "image": "/images/companies/comp-p5.webp",
      "shortDesc": "Individuelle Wandbilder und handgemalte Raumgestaltung.",
      "address": "Musterplatz 12, 60311 Frankfurt am Main",
      "phone": "+49 69 0000 0005",
      "email": "kontakt5@example.com",
      "website": "https://example.com/comp-p5",
      "prices": [
        {
          "service": "Wandbilder gestalten",
          "price": "Ab 150 €"
        },
        {
          "service": "Dekorative Oberflächen",
          "price": "30 € / m²"
        }
      ]
    },
    {
      "id": "comp-c1",
      "categoryId": "cleaning",
      "name": "Sparkle Cleaners",
      "logo": "/images/logos/sparkle.webp",
      "image": "/images/companies/comp-c1.webp",
      "shortDesc": "Gründliche Reinigung von Wohnungen und Büros.",
      "address": "Musterstraße 34, 10115 Berlin",
      "phone": "+49 30 0000 0006",
      "email": "kontakt6@example.com",
      "website": "https://example.com/comp-c1",
      "prices": [
        {
          "service": "Wohnung grundreinigen",
          "price": "50 € / Termin"
        },
        {
          "service": "Einzugs- und Auszugsreinigung",
          "price": "80 € / Termin"
        }
      ]
    },
    {
      "id": "comp-c2",
      "categoryId": "cleaning",
      "name": "Crystal Clear Glass",
      "logo": "/images/logos/crystalclear.webp",
      "image": "/images/companies/comp-c2.webp",
      "shortDesc": "Professionelle Fenster- und Glasfassadenreinigung.",
      "address": "Beispielweg 55, 20095 Hamburg",
      "phone": "+49 40 0000 0007",
      "email": "kontakt7@example.com",
      "website": "https://example.com/comp-c2",
      "prices": [
        {
          "service": "Fensterreinigung",
          "price": "40 € / Termin"
        },
        {
          "service": "Glasfassade reinigen",
          "price": "120 € / Termin"
        }
      ]
    },
    {
      "id": "comp-c3",
      "categoryId": "cleaning",
      "name": "EcoClean Homes",
      "logo": "/images/logos/ecoclean.webp",
      "image": "/images/companies/comp-c3.webp",
      "shortDesc": "Reinigung mit umweltfreundlichen Produkten.",
      "address": "Musterallee 88, 80331 München",
      "phone": "+49 89 0000 0008",
      "email": "kontakt8@example.com",
      "website": "https://example.com/comp-c3",
      "prices": [
        {
          "service": "Umweltfreundliche Reinigung",
          "price": "60 € / Termin"
        },
        {
          "service": "Teppiche und Polster reinigen",
          "price": "35 € / Stück"
        }
      ]
    },
    {
      "id": "comp-c4",
      "categoryId": "cleaning",
      "name": "Maid for You",
      "logo": "/images/logos/maidforyou.webp",
      "image": "/images/companies/comp-c4.webp",
      "shortDesc": "Regelmäßige Haushaltsreinigung nach Ihrem Bedarf.",
      "address": "Beispielstraße 21, 50667 Köln",
      "phone": "+49 221 0000 0009",
      "email": "kontakt9@example.com",
      "website": "https://example.com/comp-c4",
      "prices": [
        {
          "service": "Wöchentliche Reinigung",
          "price": "30 € / Termin"
        },
        {
          "service": "Monatliche Betreuung",
          "price": "100 € / Monat"
        }
      ]
    },
    {
      "id": "comp-c5",
      "categoryId": "cleaning",
      "name": "Prime Janitorial",
      "logo": "/images/logos/primejanitorial.webp",
      "image": "/images/companies/comp-c5.webp",
      "shortDesc": "Reinigung nach Bauarbeiten und für Gewerbeflächen.",
      "address": "Musterplatz 99, 60311 Frankfurt am Main",
      "phone": "+49 69 0000 0010",
      "email": "kontakt10@example.com",
      "website": "https://example.com/comp-c5",
      "prices": [
        {
          "service": "Baureinigung",
          "price": "150 € / Termin"
        },
        {
          "service": "Lagerhalle reinigen",
          "price": "200 € / Termin"
        }
      ]
    },
    {
      "id": "comp-a1",
      "categoryId": "auto_repair",
      "name": "Speedy Auto Fix",
      "logo": "/images/logos/speedyauto.webp",
      "image": "/images/companies/comp-a1.webp",
      "shortDesc": "Allgemeine Kfz-Reparaturen, Ölwechsel und Wartung.",
      "address": "Musterstraße 10, 10115 Berlin",
      "phone": "+49 30 0000 0011",
      "email": "kontakt11@example.com",
      "website": "https://example.com/comp-a1",
      "prices": [
        {
          "service": "Ölwechsel mit Filter",
          "price": "30 €"
        },
        {
          "service": "Bremsbeläge wechseln",
          "price": "45 €"
        }
      ]
    },
    {
      "id": "comp-a2",
      "categoryId": "auto_repair",
      "name": "Gearbox Gurus",
      "logo": "/images/logos/gearboxgurus.webp",
      "image": "/images/companies/comp-a2.webp",
      "shortDesc": "Reparatur von Schalt- und Automatikgetrieben.",
      "address": "Beispielweg 20, 20095 Hamburg",
      "phone": "+49 40 0000 0012",
      "email": "kontakt12@example.com",
      "website": "https://example.com/comp-a2",
      "prices": [
        {
          "service": "Getriebediagnose",
          "price": "50 €"
        },
        {
          "service": "Kupplung wechseln",
          "price": "180 €"
        }
      ]
    },
    {
      "id": "comp-a3",
      "categoryId": "auto_repair",
      "name": "Tire & Track",
      "logo": "/images/logos/tiretrack.webp",
      "image": "/images/companies/comp-a3.webp",
      "shortDesc": "Achsvermessung, Auswuchten und Reifenwechsel.",
      "address": "Musterallee 30, 80331 München",
      "phone": "+49 89 0000 0013",
      "email": "kontakt13@example.com",
      "website": "https://example.com/comp-a3",
      "prices": [
        {
          "service": "Achsvermessung",
          "price": "25 €"
        },
        {
          "service": "Reifenwechsel und Auswuchten",
          "price": "20 €"
        }
      ]
    },
    {
      "id": "comp-a4",
      "categoryId": "auto_repair",
      "name": "Auto Body Masters",
      "logo": "/images/logos/autobody.webp",
      "image": "/images/companies/comp-a4.webp",
      "shortDesc": "Professionelle Reparatur von Dellen und Karosserieschäden.",
      "address": "Beispielstraße 40, 50667 Köln",
      "phone": "+49 221 0000 0014",
      "email": "kontakt14@example.com",
      "website": "https://example.com/comp-a4",
      "prices": [
        {
          "service": "Kleine Dellen entfernen",
          "price": "Ab 40 €"
        },
        {
          "service": "Fahrzeuglackierung",
          "price": "Ab 400 €"
        }
      ]
    },
    {
      "id": "comp-a5",
      "categoryId": "auto_repair",
      "name": "ElectroCar Clinic",
      "logo": "/images/logos/electrocar.webp",
      "image": "/images/companies/comp-a5.webp",
      "shortDesc": "Elektronische Fahrzeugdiagnose und Reparatur.",
      "address": "Musterplatz 50, 60311 Frankfurt am Main",
      "phone": "+49 69 0000 0015",
      "email": "kontakt15@example.com",
      "website": "https://example.com/comp-a5",
      "prices": [
        {
          "service": "Systemdiagnose",
          "price": "35 €"
        },
        {
          "service": "Batterie und Lichtmaschine prüfen",
          "price": "15 €"
        }
      ]
    }
  ]
};
