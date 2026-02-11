export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  /** ID du produit (ex. gourde-connectee-thermosmart, tasse-connectee-thermosmart-200ml) */
  productId: string
  /** Optionnel : variante concernée (noir, bleu, blanc) */
  variantId?: string
}

const GOURDE_ID = "gourde-connectee-thermosmart"
const TASSE_ID = "tasse-connectee-thermosmart-200ml"
const STICKERS_WANTED_ID = "stickers-gourde-wanted"
const STICKERS_CHAT_ID = "stickers-gourde-chat"

const reviewsFr: Review[] = [
  // ——— Gourde 500 ml ———
  {
    id: "g1",
    productId: GOURDE_ID,
    author: "Marie L.",
    rating: 5,
    text: "J'en avais marre de me brûler avec le café au bureau. Là au moins je vois la tempé sur l'écran, c'est con mais ça change la vie. La mienne est noire, ça va avec tout.",
    date: "15 janv. 2025",
    variantId: "noir",
  },
  {
    id: "g2",
    productId: GOURDE_ID,
    author: "Thomas P.",
    rating: 4,
    text: "Très content dans l'ensemble. Par contre le bouchon au début il fallait appuyer un peu fort pour que ça s'allume, maintenant ça va. Le thé reste chaud longtemps c'est top.",
    date: "8 janv. 2025",
    variantId: "bleu",
  },
  {
    id: "g3",
    productId: GOURDE_ID,
    author: "Sophie M.",
    rating: 4,
    text: "Bien mieux que ma vieille gourde. Juste un peu plus lourde mais bon, pour 500 ml c'est normal. Livré en 9 jours je crois.",
    date: "2 janv. 2025",
    variantId: "blanc",
  },
  {
    id: "g4",
    productId: GOURDE_ID,
    author: "Lucas D.",
    rating: 5,
    text: "C'était pour ma copine à Noël, elle kiffe. Elle s'en sert tout le temps au taf. Moi j'ai pas testé mais elle dit que c'est nickel.",
    date: "28 déc. 2024",
    variantId: "noir",
  },
  {
    id: "g5",
    productId: GOURDE_ID,
    author: "Julie R.",
    rating: 3,
    text: "Franchement ça fait le job. L'écran est un peu petit pour mes yeux mais bon j'arrive à lire. Pour le prix je trouve ça correct.",
    date: "20 déc. 2024",
  },
  {
    id: "g6",
    productId: GOURDE_ID,
    author: "Nicolas B.",
    rating: 5,
    text: "Aucun souci, livraison rapide. La gourde tient bien au chaud, j'ai testé avec du café à 8h et à 10h c'était encore bon. Je recommande.",
    date: "12 déc. 2024",
  },
  {
    id: "g7",
    productId: GOURDE_ID,
    author: "Camille T.",
    rating: 4,
    text: "J'aime bien le design, pas trop gadget. Seul truc : j'aurais aimé une couleur un peu plus fun mais y'a que 3 choix donc j'ai pris le bleu. Content quand même.",
    date: "5 déc. 2024",
    variantId: "bleu",
  },
  // ——— Tasse 200 ml ———
  {
    id: "t1",
    productId: TASSE_ID,
    author: "Émilie V.",
    rating: 5,
    text: "Parfaite pour le café au bureau, pas trop grosse. La tempé sur le bouchon c'est exactement ce qu'il me fallait. Format 200 ml nickel.",
    date: "10 janv. 2025",
    variantId: "noir",
  },
  {
    id: "t2",
    productId: TASSE_ID,
    author: "Pierre M.",
    rating: 4,
    text: "J'ai la gourde et la tasse, la tasse c'est mon préféré pour le café le matin. Tient bien chaud, juste un peu petite pour moi mais c'est le format.",
    date: "5 janv. 2025",
  },
  {
    id: "t3",
    productId: TASSE_ID,
    author: "Léa S.",
    rating: 5,
    text: "Même qualité que la grande gourde en plus compact. Je l'utilise tout le temps pour mon thé. Livraison rapide.",
    date: "28 déc. 2024",
    variantId: "violet",
  },
  {
    id: "t4",
    productId: TASSE_ID,
    author: "Antoine L.",
    rating: 4,
    text: "Bien pour le bureau. L'écran est lisible, le bouchon tient bien. J'ai pris la bleue, elle est jolie.",
    date: "20 déc. 2024",
    variantId: "bleu",
  },
  // ——— Stickers Wanted ———
  {
    id: "s1",
    productId: STICKERS_WANTED_ID,
    author: "Maxime K.",
    rating: 5,
    text: "Les stickers sont top, bien épais et ça tient sur la gourde. Pack Wanted exactement comme sur la photo. Mon fils adore.",
    date: "8 janv. 2025",
  },
  {
    id: "s2",
    productId: STICKERS_WANTED_ID,
    author: "Inès P.",
    rating: 4,
    text: "Très bons autocollants, plusieurs modèles dans le pack. Par contre j'aurais aimé un ou deux designs en plus. Sinon nickel.",
    date: "2 janv. 2025",
  },
  // ——— Stickers Chat ———
  {
    id: "s3",
    productId: STICKERS_CHAT_ID,
    author: "Chloé D.",
    rating: 5,
    text: "Pack chats trop mignon, ça décore bien ma gourde. Résistants à l'eau, tiennent bien. Livrés vite.",
    date: "12 janv. 2025",
  },
  {
    id: "s4",
    productId: STICKERS_CHAT_ID,
    author: "Romain T.",
    rating: 4,
    text: "Les stickers memes sont drôles, bonne qualité. Ma gourde fait plus perso maintenant. Content du pack.",
    date: "30 déc. 2024",
  },
]

const reviewsEn: Review[] = [
  // ——— Gourde 500 ml ———
  {
    id: "g1",
    productId: GOURDE_ID,
    author: "Marie L.",
    rating: 5,
    text: "Got tired of burning my mouth on coffee at the office. Now I can just check the temp on the screen – sounds silly but it's a game changer. Got the black one, goes with everything.",
    date: "Jan 15, 2025",
    variantId: "noir",
  },
  {
    id: "g2",
    productId: GOURDE_ID,
    author: "Thomas P.",
    rating: 4,
    text: "Pretty happy overall. The cap was a bit stiff at first, had to press hard to get the display on – it's fine now though. Tea stays hot for ages which is nice.",
    date: "Jan 8, 2025",
    variantId: "bleu",
  },
  {
    id: "g3",
    productId: GOURDE_ID,
    author: "Sophie M.",
    rating: 4,
    text: "Way better than my old bottle. A bit heavier but that's expected for 500ml. Arrived in like 9 days I think.",
    date: "Jan 2, 2025",
    variantId: "blanc",
  },
  {
    id: "g4",
    productId: GOURDE_ID,
    author: "Lucas D.",
    rating: 5,
    text: "Bought it for my girlfriend for Christmas, she loves it. Uses it every day at work. I haven't tried it myself but she says it's great.",
    date: "Dec 28, 2024",
    variantId: "noir",
  },
  {
    id: "g5",
    productId: GOURDE_ID,
    author: "Julie R.",
    rating: 3,
    text: "Does the job honestly. The screen's a bit small for my eyes but I can read it. For the price I'd say it's fair.",
    date: "Dec 20, 2024",
  },
  {
    id: "g6",
    productId: GOURDE_ID,
    author: "Nicolas B.",
    rating: 5,
    text: "No issues, fast delivery. Keeps drinks hot – had coffee at 8am and it was still good at 10. Would recommend.",
    date: "Dec 12, 2024",
  },
  {
    id: "g7",
    productId: GOURDE_ID,
    author: "Camille T.",
    rating: 4,
    text: "Like the design, not too gimmicky. Only thing is I'd have liked more colour options but there's only 3 so I went with blue. Happy with it anyway.",
    date: "Dec 5, 2024",
    variantId: "bleu",
  },
  // ——— Tasse 200 ml ———
  {
    id: "t1",
    productId: TASSE_ID,
    author: "Emily V.",
    rating: 5,
    text: "Perfect for coffee at the office, not too big. The temp on the cap is exactly what I needed. 200ml format is spot on.",
    date: "Jan 10, 2025",
    variantId: "noir",
  },
  {
    id: "t2",
    productId: TASSE_ID,
    author: "Peter M.",
    rating: 4,
    text: "I have the bottle and the cup, the cup is my favourite for morning coffee. Keeps it hot, just a bit small for me but that's the format.",
    date: "Jan 5, 2025",
  },
  {
    id: "t3",
    productId: TASSE_ID,
    author: "Leah S.",
    rating: 5,
    text: "Same quality as the big bottle but more compact. I use it all the time for my tea. Fast delivery.",
    date: "Dec 28, 2024",
    variantId: "violet",
  },
  {
    id: "t4",
    productId: TASSE_ID,
    author: "Anthony L.",
    rating: 4,
    text: "Good for the office. Screen is readable, cap fits well. Got the blue one, looks nice.",
    date: "Dec 20, 2024",
    variantId: "bleu",
  },
  // ——— Stickers Wanted ———
  {
    id: "s1",
    productId: STICKERS_WANTED_ID,
    author: "Max K.",
    rating: 5,
    text: "Stickers are great, nice and thick and they stick well on the bottle. Wanted pack exactly as in the photo. My son loves them.",
    date: "Jan 8, 2025",
  },
  {
    id: "s2",
    productId: STICKERS_WANTED_ID,
    author: "Inez P.",
    rating: 4,
    text: "Really good stickers, several designs in the pack. Would have liked one or two more designs though. Otherwise great.",
    date: "Jan 2, 2025",
  },
  // ——— Stickers Chat ———
  {
    id: "s3",
    productId: STICKERS_CHAT_ID,
    author: "Chloe D.",
    rating: 5,
    text: "Cat pack is so cute, really brightens up my bottle. Water-resistant, stick well. Arrived quickly.",
    date: "Jan 12, 2025",
  },
  {
    id: "s4",
    productId: STICKERS_CHAT_ID,
    author: "Roman T.",
    rating: 4,
    text: "The meme stickers are funny, good quality. My bottle looks more personal now. Happy with the pack.",
    date: "Dec 30, 2024",
  },
]

/** Tous les avis (pour le carousel page d'accueil = gourde uniquement). */
export function getReviews(locale: "fr" | "en"): Review[] {
  const list = locale === "en" ? reviewsEn : reviewsFr
  return list.filter((r) => r.productId === GOURDE_ID)
}

/** Avis filtrés pour un produit donné. */
export function getReviewsForProduct(productId: string, locale: "fr" | "en"): Review[] {
  const list = locale === "en" ? reviewsEn : reviewsFr
  return list.filter((r) => r.productId === productId)
}
