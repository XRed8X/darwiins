/* =========================================================
   Darwins Ink — Catálogo (data)
   -----------------------------------------------------------
   Convención de IDs:
     "{slug-categoria}-{nnn}"   ej: "taza-001", "playera-001", "poster-001"

   Estructura producto:
   {
     id:       string   // único, ver convención
     name:     string   // nombre comercial (aparece en la tarjeta y en el msg de WhatsApp)
     price:    number   // en MXN. Si no se define, usar null y se mostrará "Consultar precio"
     image:    string[] // 1 o más URLs (locales o externas). La primera se usa como portada.
     category: string   // debe coincidir con un id de la lista `categories`
     featured: boolean  // (opcional) true para resaltar / orden prioritario
   }
   ========================================================= */

const categories = [
  // 'id' es lo que va en product.category y en los filtros.
  // 'image' se usa como portada de la categoría en la sección "Por categoría".
  { id: "playera", label: "Playeras", image: "assets/playeras/otros/gato.webp" },
  { id: "taza",    label: "Tazas",    image: "assets/tazas/anime/taza-saitama.jpeg" },
  // { id: "poster",  label: "Pósters",  image: "assets/posters/poster-bauhaus.jpeg" },
  // { id: "otros",   label: "Otros",    image: "assets/otros/otros.jpeg" },
];

const playeraProducts = [
  {
    id: "playera-001",
    name: "Playera Origin",
    price: 180,
    image: ["assets/playeras/otros/gato.webp"],
    category: "playera",
    featured: true,
  },
  {
    id: "playera-002",
    name: "Playera Power",
    price: 180,
    image: ["assets/playeras/anime/power.webp"],
    category: "playera",
  },
  {
    id: "playera-003",
    name: "Playera Modelo 01",
    price: 180,
    image: ["assets/playeras/otros/model-01.webp"],
    category: "playera",
  },
  {
    id: "playera-004",
    name: "Playera Alucard",
    price: 180,
    image: ["assets/playeras/anime/alucard.webp"],
    category: "playera",
  },
  {
    id: "playera-005",
    name: "Playera Anya",
    price: 180,
    image: ["assets/playeras/anime/anya.webp"],
    category: "playera",
  },
  {
    id: "playera-006",
    name: "Playera Death Note",
    price: 180,
    image: ["assets/playeras/anime/deathnote.webp"],
    category: "playera",
  },
    {
    id: "playera-007",
    name: "Playera Denji",
    price: 180,
    image: ["assets/playeras/anime/denji.webp"],
    category: "playera",
    featured: true,
  },
  {
    id: "playera-008",
    name: "Playera Gojo",
    price: 180,
    image: ["assets/playeras/anime/gojo.webp"],
    category: "playera",
  },
  {
    id: "playera-009",
    name: "Playera Goku",
    price: 180,
    image: ["assets/playeras/anime/goku.webp"],
    category: "playera",
  },
    {
    id: "playera-010",
    name: "Playera Nezuko",
    price: 180,
    image: ["assets/playeras/anime/nezuko.webp"],
    category: "playera",
    featured: true,
  },
  {
    id: "playera-011",
    name: "Playera Pikachu",
    price: 180,
    image: ["assets/playeras/anime/pikachu.webp"],
    category: "playera",
  },
  {
    id: "playera-012",
    name: "Playera Shisui",
    price: 180,
    image: ["assets/playeras/anime/shisui.webp"],
    category: "playera",
  },
  {
    id: "playera-013",
    name: "Playera Sukuna",
    price: 180,
    image: ["assets/playeras/anime/sukuna.webp"],
    category: "playera",
  },
  {
    id: "playera-014",
    name: "Playera Goku Family",
    price: 180,
    image: ["assets/playeras/anime/goku-2.webp"],
    category: "playera",
  },
  {
    id: "playera-015",
    name: "Playera USA",
    price: 180,
    image: [
      "assets/playeras/otros/usa.webp",
      "assets/playeras/otros/usa-2.webp"
    ],
    category: "playera",
  }
];

const tazaProducts = [
  {
    id: "taza-001",
    name: "Taza Saitama 11oz",
    price: 75,
    image: ["assets/tazas/anime/taza-saitama.jpeg", "assets/tazas/anime/taza-saitama-2.jpeg"],
    category: "taza",
  },
  {
    id: "taza-002",
    name: "Taza Death Note 11oz",
    price: 75,
    image: ["assets/tazas/anime/taza-deathnote.webp"],
    category: "taza",
  },
  {
    id: "taza-003",
    name: "Día de las Madres 11oz 0001",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0001-1.webp",
        "assets/tazas/madres/dia-de-las-madres-0001-2.webp"
    ],
    category: "taza",
  },
  {
    id: "taza-004",
    name: "Día de las Madres 11oz 0002",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0002-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0002-2.webp",
      "assets/tazas/madres/dia-de-las-madres-0002-3.webp"
    ],
    category: "taza",
  },
    {
    id: "taza-005",
    name: "Día de las Madres 11oz 0003",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0003-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0003-2.webp",
    ],
    category: "taza",
  },
    {
    id: "taza-006",
    name: "Día de las Madres 11oz 0004",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0004-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0004-2.webp",
    ],
    category: "taza",
  },
    {
    id: "taza-007",
    name: "Día de las Madres 11oz 0005",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0005-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0005-2.webp",
      "assets/tazas/madres/dia-de-las-madres-0005-3.webp"
    ],
    category: "taza",
  },
    {
    id: "taza-008",
    name: "Día de las Madres 11oz 0006",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0006-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0006-2.webp",
      "assets/tazas/madres/dia-de-las-madres-0006-3.webp"
    ],
    category: "taza",
  },
    {
    id: "taza-009",
    name: "Día de las Madres 11oz 0007",
    price: 50,
    originalPrice: 75,
    image: [
      "assets/tazas/madres/dia-de-las-madres-0007-1.webp",
      "assets/tazas/madres/dia-de-las-madres-0007-2.webp",
      "assets/tazas/madres/dia-de-las-madres-0007-3.webp"
    ],
    category: "taza",
  }
];
// const posterProducts = [
//   {
//     id: "poster-001",
//     name: "Póster Bauhaus",
//     price: null,
//     image: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=70"],
//     category: "poster",
//   },
//   {
//     id: "poster-002",
//     name: "Póster Tipográfico",
//     price: null,
//     image: ["https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=70"],
//     category: "poster",
//   },
// ];

const products = [
  ...playeraProducts,
  ...tazaProducts,
  // ...posterProducts,
];

window.DARWINS = { categories, products };
