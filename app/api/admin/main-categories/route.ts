import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"
import { getNextCatalogId } from "@/lib/next-catalog-id"

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("categoriaprincipal")
      .select("id, name, description, image")
      .order("name", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar las categorías principales.") }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ error: "Falta el nombre de la categoría principal" }, { status: 400 })
    }

    const id = await getNextCatalogId(["categoriaprincipal", "categoriaPrincipal"])

    const { data, error } = await supabaseServer
      .from("categoriaprincipal")
      .insert([
        {
          id,
          name,
          description: description || null,
          image: image || null,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al guardar la categoría principal.") }, { status: 500 })
  }
}
