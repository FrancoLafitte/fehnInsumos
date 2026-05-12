import type { Product, CategoryInfo } from "./types"

export const categories: CategoryInfo[] = [
  {
    id: "arcillas",
    name: "Arcillas",
    description: "Arcillas naturales y preparadas para modelado y torno",
    image: "/images/categories/arcillas.jpg",
  },
  {
    id: "esmaltes",
    name: "Esmaltes",
    description: "Esmaltes cerámicos de alta y baja temperatura",
    image: "/images/categories/esmaltes.jpg",
  },
  {
    id: "herramientas",
    name: "Herramientas",
    description: "Herramientas profesionales para cerámica",
    image: "/images/categories/herramientas.jpg",
  },
  {
    id: "bizcochos",
    name: "Bizcochos",
    description: "Piezas bizcochadas listas para esmaltar",
    image: "/images/categories/bizcochos.jpg",
  },
  {
    id: "oxidos-pigmentos",
    name: "Óxidos y Pigmentos",
    description: "Colorantes y óxidos para cerámica",
    image: "/images/categories/oxidos.jpg",
  },
  {
    id: "contramoldes",
    name: "Contramoldes",
    description: "Moldes y contramoldes de yeso",
    image: "/images/categories/contramoldes.jpg",
  },
]

export const products: Product[] = [
  // Arcillas
  {
    id: "arc-001",
    name: "Arcilla Roja de Alta Temperatura",
    description: "Arcilla roja natural para torno y modelado. Cocción entre 1200-1280°C. Excelente plasticidad y resistencia.",
    price: 2500,
    category: "arcillas",
    image: "/images/products/arcilla-roja.jpg",
    inStock: true,
  },
  {
    id: "arc-002",
    name: "Arcilla Blanca Refractaria",
    description: "Arcilla blanca de alta pureza para piezas delicadas. Ideal para porcelana y gres.",
    price: 3200,
    category: "arcillas",
    image: "/images/products/arcilla-blanca.jpg",
    inStock: true,
  },
  {
    id: "arc-003",
    name: "Arcilla Negra para Raku",
    description: "Arcilla especialmente formulada para técnica Raku. Alta resistencia al choque térmico.",
    price: 3800,
    category: "arcillas",
    image: "/images/products/arcilla-negra.jpg",
    inStock: true,
  },
  {
    id: "arc-004",
    name: "Arcilla Chamotada Media",
    description: "Arcilla con chamota media para esculturas y piezas de gran formato.",
    price: 2800,
    category: "arcillas",
    image: "/images/products/arcilla-chamotada.jpg",
    inStock: true,
  },
  // Esmaltes
  {
    id: "esm-001",
    name: "Esmalte Transparente Brillante",
    description: "Esmalte base transparente de alta temperatura. Ideal para resaltar el color de la arcilla.",
    price: 4500,
    category: "esmaltes",
    image: "/images/products/esmalte-transparente.jpg",
    inStock: true,
  },
  {
    id: "esm-002",
    name: "Esmalte Azul Cobalto",
    description: "Esmalte azul intenso con óxido de cobalto. Acabado brillante uniforme.",
    price: 5200,
    category: "esmaltes",
    image: "/images/products/esmalte-azul.jpg",
    inStock: true,
  },
  {
    id: "esm-003",
    name: "Esmalte Celadón Verde",
    description: "Esmalte verde jade estilo celadón asiático. Efecto translúcido elegante.",
    price: 5800,
    category: "esmaltes",
    image: "/images/products/esmalte-celadon.jpg",
    inStock: true,
  },
  {
    id: "esm-004",
    name: "Esmalte Blanco Mate",
    description: "Esmalte blanco opaco con acabado mate satinado. Muy versátil.",
    price: 4200,
    category: "esmaltes",
    image: "/images/products/esmalte-blanco.jpg",
    inStock: false,
  },
  {
    id: "esm-005",
    name: "Esmalte Tenmoku",
    description: "Esmalte marrón oscuro con efectos de cristalización. Estilo japonés tradicional.",
    price: 6200,
    category: "esmaltes",
    image: "/images/products/esmalte-tenmoku.jpg",
    inStock: true,
  },
  // Herramientas
  {
    id: "her-001",
    name: "Set de Estecas Profesional",
    description: "Set de 12 estecas de madera de boj para modelado fino. Incluye estuche.",
    price: 8500,
    category: "herramientas",
    image: "/images/products/estecas.jpg",
    inStock: true,
  },
  {
    id: "her-002",
    name: "Torneta de Mesa 25cm",
    description: "Torneta de aluminio fundido de 25cm de diámetro. Giro suave y preciso.",
    price: 15000,
    category: "herramientas",
    image: "/images/products/torneta.jpg",
    inStock: true,
  },
  {
    id: "her-003",
    name: "Alambre de Corte con Mangos",
    description: "Alambre de acero inoxidable con mangos de madera para cortar piezas del torno.",
    price: 1800,
    category: "herramientas",
    image: "/images/products/alambre-corte.jpg",
    inStock: true,
  },
  {
    id: "her-004",
    name: "Esponja Natural para Torno",
    description: "Esponja de mar natural, ideal para suavizar y alisar piezas en el torno.",
    price: 2200,
    category: "herramientas",
    image: "/images/products/esponja.jpg",
    inStock: true,
  },
  {
    id: "her-005",
    name: "Calibrador Cerámico",
    description: "Calibrador de plástico graduado para medir espesores y diámetros.",
    price: 3500,
    category: "herramientas",
    image: "/images/products/calibrador.jpg",
    inStock: false,
  },
  // Bizcochos
  {
    id: "biz-001",
    name: "Taza Bizcochada Lisa",
    description: "Taza de 300ml bizcochada lista para esmaltar. Arcilla blanca.",
    price: 1200,
    category: "bizcochos",
    image: "/images/products/taza-bizcocho.jpg",
    inStock: true,
  },
  {
    id: "biz-002",
    name: "Plato Llano 25cm Bizcochado",
    description: "Plato llano de 25cm de diámetro. Perfecto para decoración con esmaltes.",
    price: 1800,
    category: "bizcochos",
    image: "/images/products/plato-bizcocho.jpg",
    inStock: true,
  },
  {
    id: "biz-003",
    name: "Bowl Mediano Bizcochado",
    description: "Bowl de 15cm de diámetro bizcochado. Ideal para cereales o ensaladas.",
    price: 1500,
    category: "bizcochos",
    image: "/images/products/bowl-bizcocho.jpg",
    inStock: true,
  },
  {
    id: "biz-004",
    name: "Florero Cilíndrico Bizcochado",
    description: "Florero cilíndrico de 20cm de altura. Base estable, cuello estrecho.",
    price: 2800,
    category: "bizcochos",
    image: "/images/products/florero-bizcocho.jpg",
    inStock: true,
  },
  // Óxidos y Pigmentos
  {
    id: "oxi-001",
    name: "Óxido de Hierro Rojo 500g",
    description: "Óxido de hierro rojo para colorear arcillas y esmaltes. Tonos terrosos.",
    price: 2800,
    category: "oxidos-pigmentos",
    image: "/images/products/oxido-hierro.jpg",
    inStock: true,
  },
  {
    id: "oxi-002",
    name: "Óxido de Cobalto 100g",
    description: "Óxido de cobalto puro para azules intensos. Muy concentrado.",
    price: 8500,
    category: "oxidos-pigmentos",
    image: "/images/products/oxido-cobalto.jpg",
    inStock: true,
  },
  {
    id: "oxi-003",
    name: "Óxido de Cobre 250g",
    description: "Óxido de cobre para verdes y turquesas. Efectos variables según atmósfera.",
    price: 4200,
    category: "oxidos-pigmentos",
    image: "/images/products/oxido-cobre.jpg",
    inStock: true,
  },
  {
    id: "oxi-004",
    name: "Pigmento Negro Manganeso 500g",
    description: "Pigmento negro estable para decoración y coloreado de pastas.",
    price: 3500,
    category: "oxidos-pigmentos",
    image: "/images/products/pigmento-negro.jpg",
    inStock: false,
  },
  // Contramoldes
  {
    id: "con-001",
    name: "Contramolde Taza Cónica",
    description: "Contramolde de yeso para tazas cónicas. Permite producción en serie.",
    price: 4500,
    category: "contramoldes",
    image: "/images/products/contramolde-taza.jpg",
    inStock: true,
  },
  {
    id: "con-002",
    name: "Contramolde Plato 20cm",
    description: "Contramolde de yeso para platos de 20cm. Acabado profesional.",
    price: 5200,
    category: "contramoldes",
    image: "/images/products/contramolde-plato.jpg",
    inStock: true,
  },
  {
    id: "con-003",
    name: "Contramolde Bowl Orgánico",
    description: "Contramolde para bowls con forma orgánica irregular. Diseño exclusivo.",
    price: 6800,
    category: "contramoldes",
    image: "/images/products/contramolde-bowl.jpg",
    inStock: true,
  },
  {
    id: "con-004",
    name: "Set Moldes Básicos x3",
    description: "Set de 3 contramoldes básicos: taza, plato y bowl pequeño.",
    price: 12000,
    category: "contramoldes",
    image: "/images/products/set-moldes.jpg",
    inStock: true,
  },
]

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price)
}
