# Thermo Chrono — Boutique e-commerce

Boutique en ligne Next.js (gourdes connectées et produits). Paiement Stripe, panier persistant, i18n FR/EN.

## Stack

- **Next.js 15** (App Router)
- **Stripe** (Checkout, paiement)
- **Zustand** (panier)
- **Tailwind CSS** — UI
- **Prisma** (optionnel, selon config)

## Démarrage

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Stripe et NEXT_PUBLIC_APP_URL

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example`. Obligatoires :

- `STRIPE_SECRET_KEY` — clé secrète Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — clé publique Stripe
- `NEXT_PUBLIC_APP_URL` — URL du site (ex. `http://localhost:3000`)

## Scripts

| Commande      | Description              |
|---------------|--------------------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production    |
| `npm run start` | Démarrer en production  |
| `npm run lint`  | Linter le code         |

## Mise en ligne (GitHub)

1. Créer un dépôt sur [GitHub](https://github.com/new) (sans README ni .gitignore).
2. À la racine du projet :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
git push -u origin main
```

**Important :** ne commitez jamais `.env.local` (il est ignoré par `.gitignore`). Utilisez les *Secrets* du dépôt ou les variables d’environnement de votre hébergeur (Vercel, Railway, etc.) pour les clés Stripe en production.
