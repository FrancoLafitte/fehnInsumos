import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No se recibió ninguna imagen." }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const uniqueFileName = `${Date.now()}-${randomUUID()}-${safeName}`
    const filePath = path.join(uploadDir, uniqueFileName)

    const bytes = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, bytes)

    return NextResponse.json({
      ok: true,
      url: `/uploads/${uniqueFileName}`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo subir la imagen." }, { status: 500 })
  }
}
