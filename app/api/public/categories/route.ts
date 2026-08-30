import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

async function fetchMainCategories() {
  const { data, error } = await supabaseServer
    .from("categoriaprincipal")
    .select("id, name, description, image")
    .order("name", { ascending: true })

  if (error) {
    return []
  }

  return data ?? []
}

async function fetchSubcategories() {
  const { data, error } = await supabaseServer
    .from("subcategories")
    .select("id, name, description, image, categoria_principal_id")
    .order("name", { ascending: true })

  if (error) {
    return []
  }

  return data ?? []
}

export async function GET() {
  try {
    const mainCategories = await fetchMainCategories()
    const subcategories = await fetchSubcategories()

    if (!mainCategories.length && !subcategories.length) {
      return NextResponse.json({ error: normalizeUserMessage("La base no tiene categorías cargadas.", "No se pudieron cargar las categorías.") }, { status: 500 })
    }

    const grouped = (mainCategories.length ? mainCategories : []).map((main: any) => ({
      ...main,
      subcategories: (subcategories as any[]).filter((sub: any) => {
        const parentId = sub.categoria_principal_id ?? sub.categoriaprincipal_id ?? sub.category_id ?? null
        return parentId === main.id
      }),
    }))

    if (!grouped.length && subcategories.length) {
      return NextResponse.json({
        data: subcategories.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          image: sub.image,
          subcategories: [],
        })),
      })
    }

    return NextResponse.json({ data: grouped })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar las categorías.") }, { status: 500 })
  }
}
