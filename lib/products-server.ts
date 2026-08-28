import type { Product } from "./types"
import supabaseServer from "./supabaseServer"
import { unstable_noStore as noStore } from "next/cache"

type ProductRow = {
  id: string
  name: string
  description: string | null
  price: number
  category: Product["category"] | null
  image: string | null
  in_stock: boolean | null
}

function mapProduct(row: ProductRow): Product | null {
  if (!row.id || !row.name || row.price == null || !row.category) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    category: row.category,
    image: row.image ?? "",
    inStock: row.in_stock ?? true,
  }
}

export async function getPublicProducts(categoryId?: string): Promise<Product[]> {
  noStore()

  let query = supabaseServer
    .from("products")
    .select("id, name, description, price, category, image, in_stock")
    .order("created_at", { ascending: false })

  if (categoryId) {
    query = query.eq("category", categoryId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data as ProductRow[] | null | undefined)?.map(mapProduct).filter((product): product is Product => product !== null) ?? []
}

export async function getPublicProductById(id: string): Promise<Product | null> {
  noStore()

  const { data, error } = await supabaseServer
    .from("products")
    .select("id, name, description, price, category, image, in_stock")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapProduct(data as ProductRow) : null
}