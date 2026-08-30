import type { Product } from "./types"
import supabaseServer from "./supabaseServer"
import { unstable_noStore as noStore } from "next/cache"

type ProductRow = {
  id: string
  name: string
  description: string | null
  price: number
  category?: Product["category"] | null
  subcategory?: Product["category"] | null
  subcategory_id?: Product["category"] | null
  subcategorias_id?: Product["category"] | null
  image: string | null
  in_stock: boolean | null
}

function mapProduct(row: ProductRow): Product | null {
  const categoryValue = row.category ?? row.subcategory ?? row.subcategory_id ?? row.subcategorias_id ?? null

  if (!row.id || !row.name || row.price == null || !categoryValue) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    category: categoryValue,
    image: row.image ?? "",
    inStock: row.in_stock ?? true,
  }
}

export async function getPublicProducts(categoryId?: string): Promise<Product[]> {
  noStore()

  const normalizedCategoryId = categoryId?.trim()
  let groupSubcategoryIds: string[] | null = null

  if (normalizedCategoryId) {
    const { data: groupData } = await supabaseServer
      .from("categoriaprincipal")
      .select("id")
      .eq("id", normalizedCategoryId)
      .maybeSingle()

    if (groupData) {
      const { data: subcategories } = await supabaseServer
        .from("subcategories")
        .select("id")
        .eq("categoria_principal_id", normalizedCategoryId)

      groupSubcategoryIds = (subcategories ?? []).map((sub: any) => sub.id)
    }
  }

  const attempts = [
    { select: "id, name, description, price, subcategory, image, in_stock", column: "subcategory" },
    { select: "id, name, description, price, category, image, in_stock", column: "category" },
  ]

  for (const attempt of attempts) {
    let query = supabaseServer
      .from("products")
      .select(attempt.select)
      .order("created_at", { ascending: false })

    if (normalizedCategoryId) {
      if (groupSubcategoryIds && groupSubcategoryIds.length > 0) {
        query = query.in(attempt.column, groupSubcategoryIds)
      } else {
        query = query.eq(attempt.column, normalizedCategoryId)
      }
    }

    const { data, error } = await query
    if (!error && data) {
      return (data as ProductRow[])
        .map((row) => mapProduct({
          ...row,
          category: row.category ?? row.subcategory ?? row.subcategory_id ?? row.subcategorias_id ?? null,
        }))
        .filter((product): product is Product => product !== null)
    }
  }

  return []
}

export async function getPublicProductById(id: string): Promise<Product | null> {
  noStore()

  const attempts = [
    { select: "id, name, description, price, category, image, in_stock" },
    { select: "id, name, description, price, subcategory, image, in_stock" },
    { select: "id, name, description, price, subcategory_id, image, in_stock" },
    { select: "id, name, description, price, subcategorias_id, image, in_stock" },
  ]

  for (const attempt of attempts) {
    const { data, error } = await supabaseServer
      .from("products")
      .select(attempt.select)
      .eq("id", id)
      .maybeSingle()

    if (!error && data) {
      return mapProduct({
        ...(data as ProductRow),
        category: (data as any).category ?? (data as any).subcategory ?? (data as any).subcategory_id ?? (data as any).subcategorias_id ?? null,
      })
    }
  }

  return null
}