export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image: string
  inStock: boolean
}

export type Category = 
  | "arcillas"
  | "esmaltes"
  | "herramientas"
  | "bizcochos"
  | "oxidos-pigmentos"
  | "contramoldes"

export interface CartItem {
  product: Product
  quantity: number
}

export interface CategoryInfo {
  id: Category
  name: string
  description: string
  image: string
}
