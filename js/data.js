const restaurants = [
  {
    id: 'wagamama',
    name: 'Wagamama',
    category: 'Asiatisk · Japansk',
    rating: 4.6,
    delivery: '20–30 min.',
    price: '$$$',
    image: 'img/wagamama/waga2.jpg',
    tags: ['Asiatisk'],
    favorite: true,
    description: 'Autentisk japansk-inspireret mad tilberedt i et åbent køkken med friske råvarer.',
    menu: [
      {
        category: 'Populære retter',
        items: [
          { id: 'w1', name: 'Chicken Ramen',  description: 'Kyllingebouillon, nudler, blødkogt æg og forårsløg', price: 119 },
          { id: 'w2', name: 'Yasai Gyoza',    description: 'Dampede grøntsagsdumplings med dip',                 price: 79  },
          { id: 'w3', name: 'Firecracker',    description: 'Stegt kylling, chili, soya og sesam',                price: 129 },
          { id: 'w4', name: 'Pad Thai',       description: 'Risnudler med rejer, jordnødder og limejuice',       price: 109 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'w5', name: 'Japansk te', description: 'Varm grøn te', price: 39 },
          { id: 'w6', name: 'Vand',       description: '50 cl',        price: 25 },
        ]
      }
    ]
  },

  {
    id: 'pizza-notte',
    name: 'Pizza Notte',
    category: 'Pizza · Italiensk',
    rating: 4.4,
    delivery: '15–30 min.',
    price: '$',
    image: 'img/pizza notte/pizza-notte2.jpg',
    tags: ['Pizza'],
    favorite: false,
    description: 'Håndlavet neapolitansk pizza bagt i stenovn.',
    menu: [
      {
        category: 'Pizzaer',
        items: [
          { id: 'pn1', name: 'Margherita', description: 'Tomatsauce, mozzarella og basilikum', price: 99  },
          { id: 'pn2', name: 'Diavola',    description: 'Tomatsauce, mozzarella og chorizo',   price: 119 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'pn3', name: 'Sodavand', description: '33 cl', price: 29 },
        ]
      }
    ]
  },

  {
    id: 'burger-joint',
    name: 'Burger Joint',
    category: 'Burger · Amerikansk',
    rating: 3.9,
    delivery: '15–30 min.',
    price: '$$',
    image: 'img/burger joint/smash1.jpg',
    tags: ['Burger'],
    favorite: false,
    description: 'Frisklavede burgere.',
    menu: [
      {
        category: 'Burger',
        items: [
          { id: 'bj1', name: 'Classic Burger', description: 'Oksekød, ost, tomat, løg',          price: 99  },
          { id: 'bj2', name: 'Bacon Burger',   description: 'Oksekød, bacon, ost, tomat, løg',   price: 119 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'bj3', name: 'Sodavand', description: '33 cl', price: 29 },
        ]
      }
    ]
  },

  {
    id: 'sushi-lovers',
    name: 'Sushi Lovers',
    category: 'Sushi · Japansk',
    rating: 4.5,
    delivery: '15–30 min.',
    price: '$$$$',
    image: 'img/sushi lovers/sushi1.jpg',
    tags: ['Sushi'],
    favorite: false,
    description: 'Fersk fisk og råvarer.',
    menu: [
      {
        category: 'Sushi',
        items: [
          { id: 'sl1', name: 'California Roll',  description: 'Laks, avocado, crab',            price: 99  },
          { id: 'sl2', name: 'Salmon Roll',      description: 'Laks, avocado, surcharge',        price: 119 },
          { id: 'sl3', name: 'Tuna Roll',        description: 'Tun, avocado, sesam',             price: 119 },
          { id: 'sl4', name: 'Shrimp Roll',      description: 'Rejer, avocado, agurk',           price: 119 },
          { id: 'sl5', name: 'Tempura rejer',    description: 'Tempura rejer med dip',           price: 59  },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'sl6', name: 'Sodavand', description: '33 cl',    price: 29 },
          { id: 'sl7', name: 'Øl',       description: 'Pilsner',  price: 49 },
        ]
      }
    ]
  },

  {
    id: 'green-bowl',
    name: 'Green Bowl',
    category: 'Salat · Sundt',
    rating: 4.5,
    delivery: '15–25 min.',
    price: '$$$',
    image: 'img/green bowl/green1.jpg',
    tags: ['Sundt', 'Bowl'],
    favorite: false,
    description: 'Friske bowls og salater med lokale råvarer.',
    menu: [
      {
        category: 'Salater',
        items: [
          { id: 'gb1',  name: 'Green Power Bowl',       description: 'Quinoa, avocado, edamame, spinat, broccoli',               price: 109 },
          { id: 'gb2',  name: 'Chicken Caesar Bowl',    description: 'Kylling, romaine, parmesan, croutoner, caesar dressing',    price: 119 },
          { id: 'gb3',  name: 'Vegan Delight',          description: 'Falafel, hummus, rødkål, avocado, kikærter',                price: 105 },
          { id: 'gb4',  name: 'Salmon Fresh Bowl',      description: 'Laks, mango, agurk, ris, sesam',                           price: 125 },
          { id: 'gb5',  name: 'Mediterranean Bowl',     description: 'Feta, oliven, couscous, tomat, agurk',                     price: 99  },
          { id: 'gb6',  name: 'Spicy Tuna Bowl',        description: 'Tun, avocado, chili mayo, ris, forårsløg',                 price: 129 },
          { id: 'gb7',  name: 'Avocado Crunch Salad',   description: 'Avocado, mix salat, nødder, æble, vinaigrette',            price: 95  },
          { id: 'gb8',  name: 'Teriyaki Chicken Bowl',  description: 'Kylling, ris, broccoli, gulerod, teriyaki sauce',          price: 115 },
          { id: 'gb9',  name: 'Tropical Bowl',          description: 'Mango, ananas, kokos, ris, avocado',                       price: 102 },
          { id: 'gb10', name: 'Protein Boost Bowl',     description: 'Oksekød, quinoa, æg, spinat, edamame',                     price: 135 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'gb-d1', name: 'Green Detox Juice',        description: 'Æble, spinat, ingefær, citron',    price: 45 },
          { id: 'gb-d2', name: 'Mango Smoothie',           description: 'Mango, banan, appelsinjuice',      price: 49 },
          { id: 'gb-d3', name: 'Berry Boost',              description: 'Jordbær, blåbær, hindbær, yoghurt',price: 52 },
          { id: 'gb-d4', name: 'Iced Matcha Latte',        description: 'Matcha, mælk, isterninger',        price: 48 },
          { id: 'gb-d5', name: 'Fresh Lemonade',           description: 'Citron, mynte, danskvand',         price: 39 },
          { id: 'gb-d6', name: 'Avocado Smoothie',         description: 'Avocado, honning, mælk',           price: 55 },
          { id: 'gb-d7', name: 'Orange Energy Juice',      description: 'Appelsin, gulerod, ingefær',       price: 44 },
          { id: 'gb-d8', name: 'Coconut Water',            description: 'Frisk kokosvand',                  price: 35 },
          { id: 'gb-d9', name: 'Sparkling Elderflower',    description: 'Hyldeblomst, danskvand, lime',     price: 42 },
        ]
      }
    ]
  },

  {
    id: 'taco-loco',
    name: 'Taco Loco',
    category: 'Mexican · Spansk',
    rating: 4,
    delivery: '15–25 min.',
    price: '$',
    image: 'img/taco loco/taco1.jpg',
    tags: ['Tacos', 'Wraps'],
    favorite: false,
    description: 'Autentiske tacos og burritos med hjemmelavet salsa.',
    menu: [
      {
        category: 'Tacos',
        items: [
          { id: 'tl1', name: 'Chicken Taco',  description: 'Kylling, romaine, parmesan, croutoner, caesar dressing', price: 119 },
          { id: 'tl2', name: 'Vegan Delight', description: 'Falafel, hummus, rødkål, avocado, kikærter',             price: 105 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'tl-d1', name: 'Green Detox Juice', description: 'Æble, spinat, ingefær, citron', price: 45 },
          { id: 'tl-d2', name: 'Mango Smoothie',    description: 'Mango, banan, appelsinjuice',   price: 49 },
          { id: 'tl-d3', name: 'Berry Boost',       description: 'Jordbær, blåbær, hindbær, yoghurt', price: 52 },
          { id: 'tl-d4', name: 'Iced Matcha Latte', description: 'Matcha, mælk, isterninger',    price: 48 },
        ]
      }
    ]
  },

  {
    id: 'pho-viet',
    name: 'Pho Vietnam',
    category: 'Vietnamesisk · Asiatisk',
    rating: 4.3,
    delivery: '15–25 min.',
    price: '$$',
    image: 'img/pho vietnam/pho.jpg',
    tags: ['Pho', 'Asiatisk'],
    favorite: false,
    description: 'Traditionel vietnamesisk suppe kogt på okseben.',
    menu: [
      {
        category: 'Supper',
        items: [
          { id: 'pv1', name: 'Pho Bo',    description: 'Oksebouillon, risnudler, oksekød',        price: 119 },
          { id: 'pv2', name: 'Pho Ga',    description: 'Kyllingebouillon, risnudler, kylling',    price: 105 },
          { id: 'pv3', name: 'Pho Huong', description: 'Laks, mango, agurk, ris, sesam',          price: 125 },
          { id: 'pv4', name: 'Pho Tom',   description: 'Rejebouillon, risnudler, rejer',          price: 99  },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'pv-d1', name: 'Green Detox Juice', description: 'Æble, spinat, ingefær, citron', price: 45 },
          { id: 'pv-d2', name: 'Mango Smoothie',    description: 'Mango, banan, appelsinjuice',   price: 49 },
          { id: 'pv-d3', name: 'Berry Boost',       description: 'Jordbær, blåbær, hindbær, yoghurt', price: 52 },
          { id: 'pv-d4', name: 'Iced Matcha Latte', description: 'Matcha, mælk, isterninger',    price: 48 },
        ]
      }
    ]
  },

  {
    id: 'pasta-basta',
    name: 'Pasta Basta',
    category: 'Italiensk · Pasta',
    rating: 4.8,
    delivery: '15–25 min.',
    price: '$$',
    image: 'img/pasta basta/pasta1.jpg',
    tags: ['Pasta'],
    favorite: false,
    description: 'Frisklavet pasta med klassiske italienske saucer.',
    menu: [
      {
        category: 'Pastaretter',
        items: [
          { id: 'pb1', name: 'Spaghetti Carbonara',    description: 'Bacon, parmesan, æg, sort peber',              price: 129 },
          { id: 'pb2', name: 'Penne Alfredo',          description: 'Kylling, flødesauce, parmesan, persille',      price: 135 },
          { id: 'pb3', name: 'Lasagna Classica',       description: 'Oksekød, tomatsauce, mozzarella',             price: 145 },
          { id: 'pb4', name: 'Truffle Mushroom Pasta', description: 'Svampe, trøffelolie, parmesan, fløde',        price: 149 },
          { id: 'pb5', name: 'Seafood Linguine',       description: 'Rejer, muslinger, hvidløg, chili, tomatsauce',price: 159 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'pb-d1', name: 'Italian Lemon Soda',      description: 'Citron, danskvand, mynte',       price: 45 },
          { id: 'pb-d2', name: 'Peach Iced Tea',          description: 'Fersken, sort te, isterninger',  price: 42 },
          { id: 'pb-d3', name: 'Sparkling Water',         description: 'Danskvand med citron',           price: 35 },
          { id: 'pb-d4', name: 'Creamy Vanilla Milkshake',description: 'Vaniljeis, mælk, flødeskum',     price: 55 },
          { id: 'pb-d5', name: 'Fresh Orange Juice',      description: 'Friskpresset appelsinjuice',     price: 48 },
        ]
      }
    ]
  },

  {
    id: 'thai-garden',
    name: 'Thai Garden',
    category: 'Thai · Asiatisk',
    rating: 4.2,
    delivery: '15–25 min.',
    price: '$$$$',
    image: 'img/wagamama/waga3.jpg',
    tags: ['Asiatisk'],
    favorite: false,
    description: 'Autentisk thaimad lavet med friske krydderier og urter.',
    menu: [
      {
        category: 'Retter',
        items: [
          { id: 'tg1', name: 'Pad Thai',         description: 'Risnudler, kylling, æg, peanuts, bønnespirer',    price: 129 },
          { id: 'tg2', name: 'Green Curry',      description: 'Kylling, kokosmælk, bambus, thai basilikum',      price: 139 },
          { id: 'tg3', name: 'Tom Yum Soup',     description: 'Rejer, citrongræs, limeblade, chili',             price: 99  },
          { id: 'tg4', name: 'Massaman Curry',   description: 'Oksekød, kartofler, peanuts, kokosmælk',          price: 145 },
          { id: 'tg5', name: 'Crispy Duck Rice', description: 'Sprød and, jasminris, grøntsager, hoisin sauce',  price: 155 },
        ]
      },
      {
        category: 'Drikkevarer',
        items: [
          { id: 'tg-d1', name: 'Thai Iced Tea',        description: 'Sød thai te med mælk og is',    price: 45 },
          { id: 'tg-d2', name: 'Coconut Smoothie',     description: 'Kokosmælk, vanilje, is',        price: 52 },
          { id: 'tg-d3', name: 'Lemongrass Lemonade',  description: 'Citrongræs, citron, danskvand', price: 42 },
          { id: 'tg-d4', name: 'Mango Paradise',       description: 'Mango, appelsinjuice, is',      price: 49 },
          { id: 'tg-d5', name: 'Sparkling Lime Soda',  description: 'Lime, danskvand, mynte',        price: 39 },
        ]
      }
    ]
  }

];
