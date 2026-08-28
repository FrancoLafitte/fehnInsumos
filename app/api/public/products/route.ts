import { NextResponse } from "next/server"
import { getPublicProducts } from "@/lib/products-server"

export async function GET() {
  try {
    const data = await getPublicProducts()
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}