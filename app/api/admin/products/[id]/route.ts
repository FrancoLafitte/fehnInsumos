import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/admin-auth"
import supabaseServer from "@/lib/supabaseServer"
import { normalizeUserMessage } from "@/lib/es-messages"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, description, price, subcategory, image } = body

    if (!name || price == null) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const { data: currentProduct, error: currentProductError } = await supabaseServer
      .from("products")
      .select("image")
      .eq("id", id)
      .maybeSingle()

    if (currentProductError) {
      return NextResponse.json({ error: normalizeUserMessage(currentProductError.message, "No se pudo identificar la imagen actual del producto.") }, { status: 500 })
    }

    const previousImageUrl = currentProduct?.image
    const nextImageUrl = image || null

    if (previousImageUrl && nextImageUrl && previousImageUrl !== nextImageUrl) {
      const bucket = process.env.SUPABASE_UPLOAD_BUCKET || "product-images"
      const previousMatch = previousImageUrl.match(/\/storage\/v1\/object\/public\/.+?\/(.+)$/)

      if (previousMatch?.[1]) {
        const previousPath = decodeURIComponent(previousMatch[1])
        const { error: removePreviousError } = await supabaseServer.storage.from(bucket).remove([previousPath])

        if (removePreviousError) {
          console.error("No se pudo eliminar la imagen previa del storage:", removePreviousError)
        }
      }
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

    const payload = {
      name,
      description: description || null,
      price: Number(price),
      subcategory: validSubcategory,
      image: image || null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseServer.from("products").update(payload).eq("id", id).select()

    if (error) {
      return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudo actualizar el producto.") }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al actualizar el producto.") }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireAdminSession()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const { data: productData, error: productFetchError } = await supabaseServer
      .from("products")
      .select("image")
      .eq("id", id)
      .maybeSingle()

    if (productFetchError) {
      return NextResponse.json({ error: normalizeUserMessage(productFetchError.message, "No se pudo obtener el producto a eliminar.") }, { status: 500 })
    }

    const imageUrl = productData?.image
    if (imageUrl) {
      const bucket = process.env.SUPABASE_UPLOAD_BUCKET || "product-images"
      const storageMatch = imageUrl.match(/\/storage\/v1\/object\/public\/.+?\/(.+)$/)

      if (storageMatch?.[1]) {
        const objectPath = decodeURIComponent(storageMatch[1])
        const { error: deleteStorageError } = await supabaseServer.storage.from(bucket).remove([objectPath])

        if (deleteStorageError) {
          console.error("No se pudo eliminar la imagen del storage:", deleteStorageError)
        }
      }
    }

    const { error } = await supabaseServer.from("products").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: normalizeUserMessage(error.message, "No se pudo eliminar el producto.") }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: normalizeUserMessage(err?.message, "Ocurrió un error al eliminar el producto.") }, { status: 500 })
  }
}
