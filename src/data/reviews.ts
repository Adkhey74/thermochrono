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
    text: "J’en avais marre de me brûler avec le café au bureau. Là au moins je vois la tempé sur l’écran, c’est con mais ça change la vie. La mienne est noire, ça va avec tout.",
    date: "15 janv. 2025",
    variantId: "noir",
  },
  {
    id: "2",
    author: "Thomas P.",
    rating: 4,
    text: "Très content dans l’ensemble. Par contre le bouchon au début il fallait appuyer un peu fort pour que ça s’allume, maintenant ça va. Le thé reste chaud longtemps c’est top.",
    date: "8 janv. 2025",
    variantId: "bleu",
  },
  {
    id: "3",
    author: "Sophie M.",
    rating: 4,
    text: "Bien mieux que ma vieille gourde. Juste un peu plus lourde mais bon, pour 500 ml c’est normal. Livré en 9 jours je crois.",
    date: "2 janv. 2025",
    variantId: "blanc",
  },
  {
    id: "4",
    author: "Lucas D.",
    rating: 5,
    text: "C’était pour ma copine à Noël, elle kiffe. Elle s’en sert tout le temps au taf. Moi j’ai pas testé mais elle dit que c’est nickel.",
    date: "28 déc. 2024",
    variantId: "noir",
  },
  {
    id: "5",
    author: "Julie R.",
    rating: 3,
    text: "Franchement ça fait le job. L’écran est un peu petit pour mes yeux mais bon j’arrive à lire. Pour le prix je trouve ça correct.",
    date: "20 déc. 2024",
  },
  {
    id: "6",
    author: "Nicolas B.",
    rating: 5,
    text: "Aucun souci, livraison rapide. La gourde tient bien au chaud, j’ai testé avec du café à 8h et à 10h c’était encore bon. Je recommande.",
    date: "12 déc. 2024",
  },
  {
    id: "7",
    author: "Camille T.",
    rating: 4,
    text: "J’aime bien le design, pas trop gadget. Seul truc : j’aurais aimé une couleur un peu plus fun mais y’a que 3 choix donc j’ai pris le bleu. Content quand même.",
    date: "5 déc. 2024",
    variantId: "bleu",
  },
]

const reviewsEn: Review[] = [
  {
    id: "1",
    author: "Marie L.",
    rating: 5,
    text: "Got tired of burning my mouth on coffee at the office. Now I can just check the temp on the screen – sounds silly but it’s a game changer. Got the black one, goes with everything.",
    date: "Jan 15, 2025",
    variantId: "noir",
  },
  {
    id: "2",
    author: "Thomas P.",
    rating: 4,
    text: "Pretty happy overall. The cap was a bit stiff at first, had to press hard to get the display on – it’s fine now though. Tea stays hot for ages which is nice.",
    date: "Jan 8, 2025",
    variantId: "bleu",
  },
  {
    id: "3",
    author: "Sophie M.",
    rating: 4,
    text: "Way better than my old bottle. A bit heavier but that’s expected for 500ml. Arrived in like 9 days I think.",
    date: "Jan 2, 2025",
    variantId: "blanc",
  },
  {
    id: "4",
    author: "Lucas D.",
    rating: 5,
    text: "Bought it for my girlfriend for Christmas, she loves it. Uses it every day at work. I haven’t tried it myself but she says it’s great.",
    date: "Dec 28, 2024",
    variantId: "noir",
  },
  {
    id: "5",
    author: "Julie R.",
    rating: 3,
    text: "Does the job honestly. The screen’s a bit small for my eyes but I can read it. For the price I’d say it’s fair.",
    date: "Dec 20, 2024",
  },
  {
    id: "6",
    author: "Nicolas B.",
    rating: 5,
    text: "No issues, fast delivery. Keeps drinks hot – had coffee at 8am and it was still good at 10. Would recommend.",
    date: "Dec 12, 2024",
  },
  {
    id: "7",
    author: "Camille T.",
    rating: 4,
    text: "Like the design, not too gimmicky. Only thing is I’d have liked more colour options but there’s only 3 so I went with blue. Happy with it anyway.",
    date: "Dec 5, 2024",
    variantId: "bleu",
  },
]

export function getReviews(locale: "fr" | "en"): Review[] {
  return locale === "en" ? reviewsEn : reviewsFr
}

export function getReviewsForProduct(_productId: string, locale: "fr" | "en"): Review[] {
  return getReviews(locale)
}
