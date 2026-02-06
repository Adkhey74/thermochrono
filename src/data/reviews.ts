export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  /** Optionnel : variante concernée (noir, bleu, blanc) */
  variantId?: string
}

const reviewsFr: Review[] = [
  {
    id: "1",
    author: "Marie L.",
    rating: 5,
    text: "Gourde parfaite pour le bureau. L'affichage de la température évite les surprises et le design est très propre. Livraison rapide.",
    date: "2025-01-15",
    variantId: "noir",
  },
  {
    id: "2",
    author: "Thomas P.",
    rating: 5,
    text: "J'utilise ma Thermo Chrono tous les jours. Plus besoin de deviner si le café est buvable, l'écran me dit tout. Très satisfait.",
    date: "2025-01-10",
    variantId: "bleu",
  },
  {
    id: "3",
    author: "Sophie M.",
    rating: 4,
    text: "Très bon produit, isolation au top. Seul petit bémol : j'aurais aimé une pastille de couleur plus visible sur le bouchon. Sinon nickel.",
    date: "2025-01-05",
    variantId: "blanc",
  },
  {
    id: "4",
    author: "Lucas D.",
    rating: 5,
    text: "Offerte à ma copine, elle en est ravie. La gourde tient bien au chaud et l’info température en temps réel c’est vraiment pratique.",
    date: "2024-12-28",
    variantId: "noir",
  },
  {
    id: "5",
    author: "Julie R.",
    rating: 5,
    text: "Enfin une gourde connectée qui fait ce qu’il faut sans prise de tête. Design sobre, livraison sous 10 à 14 jours. Je recommande.",
    date: "2024-12-20",
  },
]

const reviewsEn: Review[] = [
  {
    id: "1",
    author: "Marie L.",
    rating: 5,
    text: "Perfect bottle for the office. The temperature display avoids surprises and the design is very clean. Fast delivery.",
    date: "2025-01-15",
    variantId: "noir",
  },
  {
    id: "2",
    author: "Thomas P.",
    rating: 5,
    text: "I use my Thermo Chrono every day. No more guessing if the coffee is drinkable, the screen tells me everything. Very satisfied.",
    date: "2025-01-10",
    variantId: "bleu",
  },
  {
    id: "3",
    author: "Sophie M.",
    rating: 4,
    text: "Great product, top insulation. Only small downside: I would have liked a more visible color dot on the cap. Otherwise perfect.",
    date: "2025-01-05",
    variantId: "blanc",
  },
  {
    id: "4",
    author: "Lucas D.",
    rating: 5,
    text: "Gave it to my girlfriend, she loves it. The bottle keeps drinks warm and the real-time temperature info is really handy.",
    date: "2024-12-28",
    variantId: "noir",
  },
  {
    id: "5",
    author: "Julie R.",
    rating: 5,
    text: "Finally a connected bottle that does what it should without the fuss. Sleek design, delivery in 10 to 14 days. I recommend it.",
    date: "2024-12-20",
  },
]

export function getReviews(locale: "fr" | "en"): Review[] {
  return locale === "en" ? reviewsEn : reviewsFr
}

export function getReviewsForProduct(_productId: string, locale: "fr" | "en"): Review[] {
  return getReviews(locale)
}
