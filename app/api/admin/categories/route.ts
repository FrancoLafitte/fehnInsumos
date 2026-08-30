import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

async function fetchSubcategories() {
  const candidates = [
    {
      table: "subcategories",
      select: "id, name, description, image, categoria_principal_id",
    },
    {
      table: "subcategorias",
      select: "id, name, description, image, categoriaprincipal_id",
    },
    {
      table: "categories",
      select: "id, name, description, image",
    },
  ]

  for (const candidate of candidates) {
    const { data, error } = await supabaseServer.from(candidate.table).select(candidate.select).order("name", { ascending: true })
    if (!error && data) {
      return data
    }
  }

  return []
}

export async function GET() {
  try {
    const data = await fetchSubcategories()
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar las subcategorías.") }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, description, image, categoria_principal_id, categoriaprincipal_id, category_id } = body

    if (!id || !name) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, name)" }, { status: 400 })
    }

    const payloadFromParent = categoria_principal_id || categoriaprincipal_id || category_id || null

    const candidates = [
      {
        table: "subcategorias",
        payload: {
          id,
          name,
          description: description || null,
          image: image || null,
          categoriaprincipal_id: payloadFromParent,
        },
      },
      {
        table: "subcategories",
        payload: {
          id,
          name,
          description: description || null,
          image: image || null,
          categoria_principal_id: payloadFromParent,
        },
      },
      {
        table: "categories",
        payload: { id, name, description: description || null, image: image || null },
      },
    ]

    for (const candidate of candidates) {
      const { data, error } = await supabaseServer.from(candidate.table).insert([candidate.payload]).select()
      if (!error) {
        return NextResponse.json({ data })
      }
    }

    return NextResponse.json({ error: normalizeUserMessage("No se pudo guardar la categoría.", "No se pudo guardar la categoría.") }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al guardar la categoría.") }, { status: 500 })
  }
}
