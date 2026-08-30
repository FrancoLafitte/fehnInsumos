import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("categories")
      .update({ name, description: description || null, image: image || null })
      .eq("id", id)
      .select()

    if (error) return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudo actualizar la categoría.") }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al actualizar la categoría.") }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const { error } = await supabaseServer.from("categories").delete().eq("id", id)
    if (error) return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudo eliminar la categoría.") }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al eliminar la categoría.") }, { status: 500 })
  }
}
