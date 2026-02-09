# Supabase — Thermo Chrono

Scripts SQL à exécuter dans le **SQL Editor** de ton projet Supabase (Dashboard → SQL Editor → New query).

## Ordre d’exécution

1. **`schema.sql`** — Crée les tables, index, RLS et triggers.
2. **`seed.sql`** — Insère les produits et variantes (gourde, tasse, stickers).

Copie-colle le contenu de chaque fichier dans l’éditeur puis clique sur **Run**.

## Tables créées

| Table              | Rôle |
|--------------------|------|
| `products`         | Catalogue (id, name, slug, description, features, in_stock, video_url). |
| `product_variants` | Variantes par produit (product_id, id, color, price, images en JSONB). |
| `orders`           | Commandes (payment_id Mollie, status, shipping_address, total, etc.). |
| `order_items`      | Lignes de commande (order_id, product_id, variant_id, quantity, unit_price). |

- **Produits / variantes** : lecture publique (RLS), pour pouvoir les charger depuis l’app ou l’API.
- **Commandes / order_items** : accès réservé au `service_role` (backend), pour enregistrer les commandes après paiement (webhook Mollie).

## Réexécuter le seed

Tu peux réexécuter `seed.sql` sans supprimer les données : les `INSERT ... ON CONFLICT DO UPDATE` mettent à jour les produits/variantes existants (même id/slug).

Pour tout réinitialiser avant de re-seeder :

```sql
TRUNCATE public.order_items, public.orders, public.product_variants, public.products RESTART IDENTITY CASCADE;
```

Puis exécute à nouveau `seed.sql`.

## Intégration dans l’app

**Enregistrement des commandes** : si `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont définis, l'app crée une commande (`orders` + `order_items`) au checkout et met à jour le statut en `paid` via le webhook Mollie. Sinon le checkout fonctionne sans enregistrement.

Pour utiliser Supabase comme source des produits au lieu de `src/data/products.ts` :

1. Installer le client : `npm install @supabase/supabase-js`
2. Créer un client Supabase (variables d’environnement `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Remplacer les appels à `getProductBySlug`, `getProductById`, `getCatalogItems()` par des requêtes Supabase vers `products` et `product_variants` (avec jointure).

Les tables sont prévues pour correspondre au modèle actuel (Product, ProductVariant) pour faciliter la migration.
