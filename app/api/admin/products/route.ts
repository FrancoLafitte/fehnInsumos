import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/admin-auth"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

export async function GET() {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data, error } = await supabaseServer
      .from("products")
      .select("id, name, description, price, subcategory, image, in_stock")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudieron cargar los productos.") }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar los productos.") }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, description, price, subcategory, image } = body

    if (!name || price == null) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const candidateTables = ["subcategories", "subcategorias", "categories"]
    let validSubcategory = null as string | null

    if (subcategory) {
      for (const tableName of candidateTables) {
        const { data, error } = await supabaseServer.from(tableName).select("id").eq("id", subcategory).limit(1)
        if (!error && data && data.length > 0) {
          validSubcategory = subcategory
          break
        }
      }

      if (!validSubcategory) {
        return NextResponse.json({ error: "La subcategoría seleccionada no existe en la base de datos." }, { status: 400 })
      }
    }

    const product = {
      id: id || undefined,
      name,
      description: description || null,
      price: Number(price),
      subcategory: validSubcategory,
      image: image || null,
      in_stock: true,
    }

    const { data, error } = await supabaseServer.from("products").insert([product])

    if (error) {
      return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudo crear el producto.") }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al crear el producto.") }, { status: 500 })
  }
}
