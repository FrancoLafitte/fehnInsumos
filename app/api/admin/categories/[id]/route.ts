import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, description, image, categoria_principal_id, categoriaprincipal_id, category_id } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const parentId = categoria_principal_id || categoriaprincipal_id || category_id || null

    const candidates = [
      {
        table: "subcategorias",
        payload: {
          name,
          description: description || null,
          image: image || null,
          categoriaprincipal_id: parentId,
        },
      },
      {
        table: "subcategories",
        payload: {
          name,
          description: description || null,
          image: image || null,
          categoria_principal_id: parentId,
        },
      },
      {
        table: "categories",
        payload: { name, description: description || null, image: image || null },
      },
    ]

    for (const candidate of candidates) {
      const { data, error } = await supabaseServer.from(candidate.table).update(candidate.payload).eq("id", id).select()
      if (!error) {
        return NextResponse.json({ data })
      }
    }

    return NextResponse.json({ error: normalizeUserMessage("No se pudo actualizar la categoría.", "No se pudo actualizar la categoría.") }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al actualizar la categoría.") }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const candidates = ["subcategorias", "subcategories", "categories"]

    for (const tableName of candidates) {
      const { error } = await supabaseServer.from(tableName).delete().eq("id", id)
      if (!error) {
        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ error: normalizeUserMessage("No se pudo eliminar la categoría.", "No se pudo eliminar la categoría.") }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al eliminar la categoría.") }, { status: 500 })
  }
}
