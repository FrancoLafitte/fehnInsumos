import { NextResponse } from "next/server"
import { getPublicProducts } from "@/lib/products-server"

import { normalizeUserMessage } from "@/lib/es-messages"

export async function GET() {
  try {
    const data = await getPublicProducts()
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al cargar los productos.") }, { status: 500 })
  }
}