import type { CategoryInfo } from "./types"

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
    id: "contramoldes",
    name: "Contramoldes",
    description: "Moldes y contramoldes de yeso",
    image: "/images/categories/contramoldes.jpg",
  },
  {
    id: "engobes-rahue",
    name: "Engobes Rahue",
    description: "Engobes de terminación y decoración",
    image: "",
  },
  {
    id: "stencils",
    name: "Stencils",
    description: "Plantillas para decoración y repetición de patrones",
    image: "",
  },
  {
    id: "transfers",
    name: "Transfers",
    description: "Transfers cerámicos para decoración",
    image: "",
  },
  {
    id: "quimica",
    name: "Química",
    description: "Productos químicos para proceso y formulación",
    image: "",
  },
  {
    id: "pigmentos",
    name: "Pigmentos",
    description: "Pigmentos para coloración y decoración",
    image: "",
  },
  {
    id: "oxidos",
    name: "Óxidos",
    description: "Óxidos y colorantes cerámicos",
    image: "/images/categories/oxidos.jpg",
  },
  {
    id: "cortantes",
    name: "Cortantes",
    description: "Herramientas de corte y perforado",
    image: "",
  },
  {
    id: "sellos",
    name: "Sellos",
    description: "Sellos decorativos para cerámica",
    image: "",
  },
  {
    id: "barbotinas",
    name: "Barbotinas",
    description: "Barbotinas y pastas líquidas",
    image: "",
  },
  {
    id: "sellos-de-goma",
    name: "Sellos de goma",
    description: "Sellos de goma para impresión y decoración",
    image: "",
  },
]

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
