import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

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
    const { id, name, description, image } = body

    if (!id || !name) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, name)" }, { status: 400 })
    }

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
