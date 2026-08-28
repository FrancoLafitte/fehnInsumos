import { NextResponse } from "next/server"
import supabaseServer from "@/lib/supabaseServer"

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("categories").select("*")
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
