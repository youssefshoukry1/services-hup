const gallery = {
  "comp-p1": [
    ["painting-1", "Maler streicht eine Wohnungswand"],
    ["comp-p1-2", "Maler arbeitet an einem Fensterrahmen"],
    ["comp-p1-3", "Holzgeländer wird lasiert"],
    ["comp-p1-4", "Hausfassade wird gestrichen"],
  ],
  "comp-p2": [
    ["painting-2", "Dekorateurin bringt Tapete an"],
    ["comp-p2-2", "Mustertapete wird ausgerichtet"],
    ["comp-p2-3", "Dekorputz wird angemischt"],
    ["comp-p2-4", "Wand erhält eine strukturierte Oberfläche"],
  ],
  "comp-p3": [
    ["painting-3", "Maler streicht eine Hausfassade"],
    ["comp-p3-2", "Industrieboden wird vorbereitet"],
    ["comp-p3-3", "Bürowand wird beschichtet"],
    ["comp-p3-4", "Beschichteter Boden wird geprüft"],
  ],
  "comp-p4": [
    ["comp-p4-1", "Zimmerdecke wird gestrichen"],
    ["comp-p4-2", "Schlafzimmerwand wird neu gestrichen"],
    ["comp-p4-3", "Leisten werden für den Anstrich abgeklebt"],
    ["comp-p4-4", "Flur wird frisch gestrichen"],
  ],
  "comp-p5": [
    ["painting-4", "Künstlerin gestaltet ein Wandbild"],
    ["comp-p5-2", "Wandbild erhält feine Details"],
    ["comp-p5-3", "Dekorative Wandoberfläche wird bearbeitet"],
    ["comp-p5-4", "Entwurf wird auf eine Wand skizziert"],
  ],
  "comp-c1": [
    ["cleaning-1", "Reinigungskraft reinigt eine Küche"],
    ["comp-c1-2", "Badfliesen werden gründlich gereinigt"],
    ["comp-c1-3", "Wohnzimmerteppich wird gesaugt"],
    ["comp-c1-4", "Bürotische werden gereinigt"],
  ],
  "comp-c2": [
    ["cleaning-2", "Fachkraft reinigt große Fenster"],
    ["comp-c2-2", "Glasfassade wird gereinigt"],
    ["comp-c2-3", "Glastür eines Geschäfts wird poliert"],
    ["comp-c2-4", "Fensterrahmen werden gewaschen"],
  ],
  "comp-c3": [
    ["cleaning-3", "Reinigungskraft säubert ein Sofa"],
    ["comp-c3-2", "Holztisch wird mit einem Tuch gereinigt"],
    ["comp-c3-3", "Teppich wird mit einer Maschine gewaschen"],
    ["comp-c3-4", "Küchenflächen werden schonend gereinigt"],
  ],
  "comp-c4": [
    ["comp-c4-1", "Bett wird frisch bezogen"],
    ["comp-c4-2", "Essbereich wird gesaugt"],
    ["comp-c4-3", "Wäsche wird zusammengelegt"],
    ["comp-c4-4", "Wohnzimmerregal wird entstaubt"],
  ],
  "comp-c5": [
    ["cleaning-4", "Team reinigt eine Lagerhalle"],
    ["comp-c5-2", "Baustaub wird aus einem Flur entfernt"],
    ["comp-c5-3", "Büro nach Bauarbeiten wird gereinigt"],
    ["comp-c5-4", "Industrieboden wird maschinell gereinigt"],
  ],
  "comp-a1": [
    ["auto-1", "Mechaniker wartet einen Automotor"],
    ["comp-a1-2", "Bremsbeläge werden geprüft"],
    ["comp-a1-3", "Ölfilter wird gewechselt"],
    ["comp-a1-4", "Motor erhält eine Inspektion"],
  ],
  "comp-a2": [
    ["auto-2", "Fachkraft prüft ein Getriebe"],
    ["comp-a2-2", "Getriebefehler wird diagnostiziert"],
    ["comp-a2-3", "Kupplung wird ausgetauscht"],
    ["comp-a2-4", "Getriebeteile werden montiert"],
  ],
  "comp-a3": [
    ["auto-3", "Technikerin montiert einen Autoreifen"],
    ["comp-a3-2", "Rad wird ausgewuchtet"],
    ["comp-a3-3", "Achsvermessung wird durchgeführt"],
    ["comp-a3-4", "Radschrauben werden angezogen"],
  ],
  "comp-a4": [
    ["auto-4", "Karosseriebauer repariert eine Autotür"],
    ["comp-a4-2", "Karosserieteil wird geschliffen"],
    ["comp-a4-3", "Stoßfänger wird lackiert"],
    ["comp-a4-4", "Reparierte Karosserie wird geprüft"],
  ],
  "comp-a5": [
    ["comp-a5-1", "Fahrzeug wird elektronisch diagnostiziert"],
    ["comp-a5-2", "Autobatterie wird gemessen"],
    ["comp-a5-3", "Elektrischer Fehler wird gesucht"],
    ["comp-a5-4", "Lichtmaschinenanschlüsse werden geprüft"],
  ],
};

export function getGalleryImages(companyId) {
  return (gallery[companyId] ?? []).map(([name, alt]) => ({
    src: `/images/service-gallery/${name}.webp`,
    alt,
  }));
}
