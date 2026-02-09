-- =============================================================================
-- Thermo Chrono — Schéma Supabase
-- À exécuter dans l’éditeur SQL du projet Supabase (Dashboard > SQL Editor).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Produits
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products (in_stock);

COMMENT ON TABLE public.products IS 'Catalogue produits (gourdes, tasses, stickers).';

-- -----------------------------------------------------------------------------
-- Variantes de produits (couleur, prix, images)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  color TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  images JSONB NOT NULL DEFAULT '[]',
  PRIMARY KEY (product_id, id)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants (product_id);

COMMENT ON TABLE public.product_variants IS 'Variantes (couleur / pack) par produit.';

-- -----------------------------------------------------------------------------
-- Commandes (pour enregistrer les commandes après paiement Mollie)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  email TEXT,
  shipping_address JSONB,
  total_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders (payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

COMMENT ON TABLE public.orders IS 'Commandes (lien avec Mollie payment_id).';

-- -----------------------------------------------------------------------------
-- Lignes de commande
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

COMMENT ON TABLE public.order_items IS 'Détail des articles par commande.';

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Lecture publique : produits et variantes
CREATE POLICY "products_select_all" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "product_variants_select_all" ON public.product_variants
  FOR SELECT USING (true);

-- Commandes : lecture/écriture via service_role (API) ; pas d’accès anon par défaut
CREATE POLICY "orders_all_service" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "order_items_all_service" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- Trigger updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
