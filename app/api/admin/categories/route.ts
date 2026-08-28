import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, description, image } = body

    if (!id || !name) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, name)" }, { status: 400 })
    }

    const { data, error } = await supabaseServer.from("categories").insert([{ id, name, description: description || null, image: image || null }])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
