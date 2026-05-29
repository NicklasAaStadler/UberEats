-- ============================================================
--  Kør denne i Supabase SQL Editor for at indsætte data
-- ============================================================

INSERT INTO restaurants (id, name, category, rating, delivery, price, image, description, studierabat, tags) VALUES
  ('wagamama',    'Wagamama',     'Asiatisk · Japansk',       4.6, '20–30 min.', '$$$',  'img/wagamama/waga2.jpg',             'Autentisk japansk-inspireret mad tilberedt i et åbent køkken med friske råvarer.', 30,   ARRAY['Asiatisk']),
  ('pizza-notte', 'Pizza Notte',  'Pizza · Italiensk',        4.4, '15–30 min.', '$',    'img/pizza notte/pizza-notte2.jpg',   'Håndlavet neapolitansk pizza bagt i stenovn.',                                       20,   ARRAY['Pizza']),
  ('burger-joint','Burger Joint', 'Burger · Amerikansk',      3.9, '15–30 min.', '$$',   'img/burger joint/smash1.jpg',        'Frisklavede burgere.',                                                               NULL, ARRAY['Burger']),
  ('sushi-lovers','Sushi Lovers', 'Sushi · Japansk',          4.5, '15–30 min.', '$$$$', 'img/sushi lovers/sushi1.jpg',        'Fersk fisk og råvarer.',                                                             20,   ARRAY['Sushi']),
  ('green-bowl',  'Green Bowl',   'Salat · Sundt',            4.5, '15–25 min.', '$$$',  'img/green bowl/green1.jpg',          'Friske bowls og salater med lokale råvarer.',                                        20,   ARRAY['Sundt', 'Bowl']),
  ('taco-loco',   'Taco Loco',    'Mexican · Spansk',         4.0, '15–25 min.', '$',    'img/Taco Loco/taco1.jpg',            'Autentiske tacos og burritos med hjemmelavet salsa.',                                NULL, ARRAY['Tacos', 'Wraps']),
  ('pho-viet',    'Pho Vietnam',  'Vietnamesisk · Asiatisk',  4.3, '15–25 min.', '$$',   'img/Pho Vietnam/pho.jpg',            'Traditionel vietnamesisk suppe kogt på okseben.',                                    NULL, ARRAY['Pho', 'Asiatisk']),
  ('pasta-basta', 'Pasta Basta',  'Italiensk · Pasta',        4.8, '15–25 min.', '$$',   'img/Pasta Basta/pasta1.jpg',         'Frisklavet pasta med klassiske italienske saucer.',                                  20,   ARRAY['Pasta']),
  ('thai-garden', 'Thai Garden',  'Thai · Asiatisk',          4.2, '15–25 min.', '$$$$', 'img/wagamama/waga3.jpg',             'Autentisk thaimad lavet med friske krydderier og urter.',                            NULL, ARRAY['Asiatisk']);

DO $$
DECLARE cat integer;
BEGIN

-- ── Wagamama ──────────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('wagamama', 'Populære retter') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('w1', cat, 'Chicken Ramen',  'Kyllingebouillon, nudler, blødkogt æg og forårsløg', 119),
  ('w2', cat, 'Yasai Gyoza',    'Dampede grøntsagsdumplings med dip',                  79),
  ('w3', cat, 'Firecracker',    'Stegt kylling, chili, soya og sesam',                129),
  ('w4', cat, 'Pad Thai',       'Risnudler med rejer, jordnødder og limejuice',        109);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('wagamama', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('w5', cat, 'Japansk te', 'Varm grøn te', 39),
  ('w6', cat, 'Vand',       '50 cl',        25);

-- ── Pizza Notte ───────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('pizza-notte', 'Pizzaer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pn1', cat, 'Margherita', 'Tomatsauce, mozzarella og basilikum',  99),
  ('pn2', cat, 'Diavola',    'Tomatsauce, mozzarella og chorizo',    119);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('pizza-notte', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pn3', cat, 'Sodavand', '33 cl', 29);

-- ── Burger Joint ──────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('burger-joint', 'Burger') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('bj1', cat, 'Classic Burger', 'Oksekød, ost, tomat, løg',        99),
  ('bj2', cat, 'Bacon Burger',   'Oksekød, bacon, ost, tomat, løg', 119);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('burger-joint', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('bj3', cat, 'Sodavand', '33 cl', 29);

-- ── Sushi Lovers ──────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('sushi-lovers', 'Sushi') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('sl1', cat, 'California Roll', 'Laks, avocado, crab',   99),
  ('sl2', cat, 'Salmon Roll',     'Laks, avocado, sesam',  119),
  ('sl3', cat, 'Tuna Roll',       'Tun, avocado, sesam',   119),
  ('sl4', cat, 'Shrimp Roll',     'Rejer, avocado, agurk', 119),
  ('sl5', cat, 'Tempura rejer',   'Tempura rejer med dip',  59);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('sushi-lovers', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('sl6', cat, 'Sodavand', '33 cl',   29),
  ('sl7', cat, 'Øl',       'Pilsner', 49);

-- ── Green Bowl ────────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('green-bowl', 'Salater') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('gb1',  cat, 'Green Power Bowl',      'Quinoa, avocado, edamame, spinat, broccoli',               109),
  ('gb2',  cat, 'Chicken Caesar Bowl',   'Kylling, romaine, parmesan, croutoner, caesar dressing',   119),
  ('gb3',  cat, 'Vegan Delight',         'Falafel, hummus, rødkål, avocado, kikærter',               105),
  ('gb4',  cat, 'Salmon Fresh Bowl',     'Laks, mango, agurk, ris, sesam',                           125),
  ('gb5',  cat, 'Mediterranean Bowl',    'Feta, oliven, couscous, tomat, agurk',                      99),
  ('gb6',  cat, 'Spicy Tuna Bowl',       'Tun, avocado, chili mayo, ris, forårsløg',                 129),
  ('gb7',  cat, 'Avocado Crunch Salad',  'Avocado, mix salat, nødder, æble, vinaigrette',             95),
  ('gb8',  cat, 'Teriyaki Chicken Bowl', 'Kylling, ris, broccoli, gulerod, teriyaki sauce',          115),
  ('gb9',  cat, 'Tropical Bowl',         'Mango, ananas, kokos, ris, avocado',                       102),
  ('gb10', cat, 'Protein Boost Bowl',    'Oksekød, quinoa, æg, spinat, edamame',                     135);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('green-bowl', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('gb-d1', cat, 'Green Detox Juice',      'Æble, spinat, ingefær, citron',      45),
  ('gb-d2', cat, 'Mango Smoothie',         'Mango, banan, appelsinjuice',        49),
  ('gb-d3', cat, 'Berry Boost',            'Jordbær, blåbær, hindbær, yoghurt',  52),
  ('gb-d4', cat, 'Iced Matcha Latte',      'Matcha, mælk, isterninger',          48),
  ('gb-d5', cat, 'Fresh Lemonade',         'Citron, mynte, danskvand',           39),
  ('gb-d6', cat, 'Avocado Smoothie',       'Avocado, honning, mælk',             55),
  ('gb-d7', cat, 'Orange Energy Juice',    'Appelsin, gulerod, ingefær',         44),
  ('gb-d8', cat, 'Coconut Water',          'Frisk kokosvand',                    35),
  ('gb-d9', cat, 'Sparkling Elderflower',  'Hyldeblomst, danskvand, lime',       42);

-- ── Taco Loco ─────────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('taco-loco', 'Tacos') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('tl1', cat, 'Chicken Taco',  'Kylling, romaine, parmesan, croutoner, caesar dressing', 119),
  ('tl2', cat, 'Vegan Delight', 'Falafel, hummus, rødkål, avocado, kikærter',             105);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('taco-loco', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('tl-d1', cat, 'Green Detox Juice', 'Æble, spinat, ingefær, citron',     45),
  ('tl-d2', cat, 'Mango Smoothie',    'Mango, banan, appelsinjuice',       49),
  ('tl-d3', cat, 'Berry Boost',       'Jordbær, blåbær, hindbær, yoghurt', 52),
  ('tl-d4', cat, 'Iced Matcha Latte', 'Matcha, mælk, isterninger',         48);

-- ── Pho Vietnam ───────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('pho-viet', 'Supper') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pv1', cat, 'Pho Bo',    'Oksebouillon, risnudler, oksekød',     119),
  ('pv2', cat, 'Pho Ga',    'Kyllingebouillon, risnudler, kylling', 105),
  ('pv3', cat, 'Pho Huong', 'Laks, mango, agurk, ris, sesam',       125),
  ('pv4', cat, 'Pho Tom',   'Rejebouillon, risnudler, rejer',        99);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('pho-viet', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pv-d1', cat, 'Green Detox Juice', 'Æble, spinat, ingefær, citron',     45),
  ('pv-d2', cat, 'Mango Smoothie',    'Mango, banan, appelsinjuice',       49),
  ('pv-d3', cat, 'Berry Boost',       'Jordbær, blåbær, hindbær, yoghurt', 52),
  ('pv-d4', cat, 'Iced Matcha Latte', 'Matcha, mælk, isterninger',         48);

-- ── Pasta Basta ───────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('pasta-basta', 'Pastaretter') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pb1', cat, 'Spaghetti Carbonara',    'Bacon, parmesan, æg, sort peber',               129),
  ('pb2', cat, 'Penne Alfredo',          'Kylling, flødesauce, parmesan, persille',        135),
  ('pb3', cat, 'Lasagna Classica',       'Oksekød, tomatsauce, mozzarella',               145),
  ('pb4', cat, 'Truffle Mushroom Pasta', 'Svampe, trøffelolie, parmesan, fløde',          149),
  ('pb5', cat, 'Seafood Linguine',       'Rejer, muslinger, hvidløg, chili, tomatsauce',  159);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('pasta-basta', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('pb-d1', cat, 'Italian Lemon Soda',       'Citron, danskvand, mynte',      45),
  ('pb-d2', cat, 'Peach Iced Tea',           'Fersken, sort te, isterninger', 42),
  ('pb-d3', cat, 'Sparkling Water',          'Danskvand med citron',          35),
  ('pb-d4', cat, 'Creamy Vanilla Milkshake', 'Vaniljeis, mælk, flødeskum',    55),
  ('pb-d5', cat, 'Fresh Orange Juice',       'Friskpresset appelsinjuice',    48);

-- ── Thai Garden ───────────────────────────────────────────
INSERT INTO menu_categories (restaurant_id, name) VALUES ('thai-garden', 'Retter') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('tg1', cat, 'Pad Thai',         'Risnudler, kylling, æg, peanuts, bønnespirer',   129),
  ('tg2', cat, 'Green Curry',      'Kylling, kokosmælk, bambus, thai basilikum',      139),
  ('tg3', cat, 'Tom Yum Soup',     'Rejer, citrongræs, limeblade, chili',              99),
  ('tg4', cat, 'Massaman Curry',   'Oksekød, kartofler, peanuts, kokosmælk',          145),
  ('tg5', cat, 'Crispy Duck Rice', 'Sprød and, jasminris, grøntsager, hoisin sauce',  155);

INSERT INTO menu_categories (restaurant_id, name) VALUES ('thai-garden', 'Drikkevarer') RETURNING id INTO cat;
INSERT INTO menu_items (id, category_id, name, description, price) VALUES
  ('tg-d1', cat, 'Thai Iced Tea',       'Sød thai te med mælk og is',    45),
  ('tg-d2', cat, 'Coconut Smoothie',    'Kokosmælk, vanilje, is',        52),
  ('tg-d3', cat, 'Lemongrass Lemonade', 'Citrongræs, citron, danskvand', 42),
  ('tg-d4', cat, 'Mango Paradise',      'Mango, appelsinjuice, is',      49),
  ('tg-d5', cat, 'Sparkling Lime Soda', 'Lime, danskvand, mynte',        39);

END $$;
