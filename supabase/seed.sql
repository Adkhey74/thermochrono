-- =============================================================================
-- Thermo Chrono — Données initiales (produits + variantes)
-- Exécuter après schema.sql dans l’éditeur SQL Supabase.
-- =============================================================================

-- Nettoyer les données existantes (optionnel : décommenter si vous repartez de zéro)
-- TRUNCATE public.order_items, public.orders, public.product_variants, public.products RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- Produits
-- -----------------------------------------------------------------------------
INSERT INTO public.products (id, name, slug, description, short_description, features, in_stock, video_url)
VALUES
  (
    'gourde-connectee-thermosmart',
    'Gourde connectée Thermo Chrono',
    'gourde-connectee-thermosmart',
    'Gourde intelligente en acier inoxydable avec affichage de température intégré sur le bouchon. Restez hydraté en toute connaissance : l''écran numérique affiche la température du liquide en temps réel. Design épuré, isolation performante, idéale au bureau ou en déplacement.',
    'Gourde intelligente avec affichage de température en temps réel. Plusieurs couleurs disponibles.',
    '["Affichage température en temps réel sur le bouchon","Acier inoxydable, finition mate","Isolation thermique longue durée","Capacité 500 ml","Sans BPA"]',
    true,
    NULL
  ),
  (
    'tasse-connectee-thermosmart-200ml',
    'Tasse connectée Thermo Chrono 200 ml',
    'tasse-connectee-thermosmart-200ml',
    'Tasse intelligente 200 ml en acier inoxydable avec affichage de température intégré sur le bouchon. Même technologie que la gourde Thermo Chrono dans un format compact : idéale pour le café ou les petites portions au bureau.',
    'Tasse 200 ml avec affichage de température en temps réel. Format compact, finition noire mate.',
    '["Affichage température en temps réel sur le bouchon","Acier inoxydable, finition mate","Isolation thermique longue durée","Capacité 200 ml","Sans BPA"]',
    true,
    NULL
  ),
  (
    'stickers-gourde-wanted',
    'Stickers gourde — Pack Wanted',
    'stickers-gourde-wanted',
    'Pack d''autocollants style « Wanted » à apposer sur votre gourde ou tasse Thermo Chrono. Designs inspirés des affiches de recherche, résistants et personnalisables. Plusieurs personnages au choix dans le pack.',
    'Autocollants décoratifs pour personnaliser votre gourde Thermo Chrono. Pack Wanted, plusieurs designs.',
    '["Autocollants résistants à l''eau","Compatible gourde et tasse Thermo Chrono","Plusieurs designs dans le pack","Pose facile, repositionnables"]',
    true,
    NULL
  ),
  (
    'stickers-gourde-chat',
    'Stickers gourde — Pack Chat',
    'stickers-gourde-chat',
    'Pack d''autocollants chats et memes à apposer sur votre gourde ou tasse Thermo Chrono. Designs humoristiques, résistants à l''eau. Plusieurs modèles dans le pack pour personnaliser votre gourde.',
    'Autocollants décoratifs chats et memes pour personnaliser votre gourde Thermo Chrono.',
    '["Autocollants résistants à l''eau","Compatible gourde et tasse Thermo Chrono","Plusieurs designs chats et memes dans le pack","Pose facile, repositionnables"]',
    true,
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  features = EXCLUDED.features,
  in_stock = EXCLUDED.in_stock,
  video_url = EXCLUDED.video_url,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- Variantes — Gourde 500 ml
-- -----------------------------------------------------------------------------
INSERT INTO public.product_variants (id, product_id, color, price, images)
VALUES
  ('noir', 'gourde-connectee-thermosmart', 'Noir', 19.99, '["/images/gourde_noir.png","/images/gourdeNoir.png","/images/gourde_noir_woman.jpg"]'),
  ('bleu', 'gourde-connectee-thermosmart', 'Bleu pastel', 19.99, '["/images/gourde bleu.png"]'),
  ('blanc', 'gourde-connectee-thermosmart', 'Blanc', 19.99, '["/images/gourde_blanche.png"]'),
  ('rouge', 'gourde-connectee-thermosmart', 'Rouge', 19.99, '["/images/gourde_rouge.png"]'),
  ('violet', 'gourde-connectee-thermosmart', 'Violet', 19.99, '["/images/gourde_violet.png"]')
ON CONFLICT (product_id, id) DO UPDATE SET
  color = EXCLUDED.color,
  price = EXCLUDED.price,
  images = EXCLUDED.images;

-- -----------------------------------------------------------------------------
-- Variantes — Tasse 200 ml
-- -----------------------------------------------------------------------------
INSERT INTO public.product_variants (id, product_id, color, price, images)
VALUES
  ('noir', 'tasse-connectee-thermosmart-200ml', 'Noir', 12.99, '["/images/tasseNoir.png"]'),
  ('bleu', 'tasse-connectee-thermosmart-200ml', 'Bleu pastel', 12.99, '["/images/tasseBleu.png"]'),
  ('violet', 'tasse-connectee-thermosmart-200ml', 'Violet', 12.99, '["/images/tasseViolet.png"]'),
  ('blanc', 'tasse-connectee-thermosmart-200ml', 'Blanc', 12.99, '["/images/tasseBlanche.png"]')
ON CONFLICT (product_id, id) DO UPDATE SET
  color = EXCLUDED.color,
  price = EXCLUDED.price,
  images = EXCLUDED.images;

-- -----------------------------------------------------------------------------
-- Variantes — Stickers Wanted
-- -----------------------------------------------------------------------------
INSERT INTO public.product_variants (id, product_id, color, price, images)
VALUES
  ('pack-wanted', 'stickers-gourde-wanted', 'Pack Wanted', 2.99, '["/images/stickers_OP.png","/images/stickerOP.png"]')
ON CONFLICT (product_id, id) DO UPDATE SET
  color = EXCLUDED.color,
  price = EXCLUDED.price,
  images = EXCLUDED.images;

-- -----------------------------------------------------------------------------
-- Variantes — Stickers Chat
-- -----------------------------------------------------------------------------
INSERT INTO public.product_variants (id, product_id, color, price, images)
VALUES
  ('pack-chat', 'stickers-gourde-chat', '', 2.99, '["/images/stickers_chat.png","/images/stickersChat.png"]')
ON CONFLICT (product_id, id) DO UPDATE SET
  color = EXCLUDED.color,
  price = EXCLUDED.price,
  images = EXCLUDED.images;
