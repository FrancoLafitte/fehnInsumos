import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/admin-auth"
import supabaseServer from "@/lib/supabaseServer"

export async function GET() {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data, error } = await supabaseServer
      .from("products")
      .select("id, name, description, price, category, image, in_stock")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, description, price, category, image } = body

    if (!name || price == null) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const product = {
      id: id || undefined,
      name,
      description: description || null,
      price: Number(price),
      category: category || null,
      image: image || null,
      in_stock: true,
    }

    const { data, error } = await supabaseServer.from("products").insert([product])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
