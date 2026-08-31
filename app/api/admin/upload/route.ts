import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

import { requireAdminSession } from "@/lib/admin-auth"
import supabaseServer from "@/lib/supabaseServer"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No se recibió ninguna imagen." }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 })
    }

    const bucket = process.env.SUPABASE_UPLOAD_BUCKET || "product-images"
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `${Date.now()}-${randomUUID()}-${safeName}`

    const { error: uploadError } = await supabaseServer.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data: publicUrlData } = supabaseServer.storage.from(bucket).getPublicUrl(storagePath)

    return NextResponse.json({
      ok: true,
      url: publicUrlData?.publicUrl || `/uploads/${storagePath}`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo subir la imagen." }, { status: 500 })
  }
}
