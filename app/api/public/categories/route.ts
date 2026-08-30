import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("categories").select("*")
    if (error) return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudieron cargar las categorías.") }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar las categorías.") }, { status: 500 })
  }
}
