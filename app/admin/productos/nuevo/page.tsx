"use client"

import React, { useState } from "react"
import { normalizeUserMessage } from "@/lib/es-messages"

type SubcategoryOption = {
  id: string
  name: string
  categoria_principal_id?: string | null
  categoriaprincipal_id?: string | null
}

export default function NewProductPage() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    images: "",
  })
  const [categories, setCategories] = useState<SubcategoryOption[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return

    setUploadingImage(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudo subir la imagen")

      const nextImages = form.images ? `${form.images}, ${json.url}` : json.url
      setForm((s) => ({ ...s, images: nextImages }))
      setMessage("Imagen subida correctamente.")
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudo subir la imagen."))
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        id: form.id || undefined,
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        subcategory: form.category,
        image: form.images.split(",")[0]?.trim() || null,
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al crear producto")

      setMessage("Producto creado correctamente.")
      setForm({ id: "", name: "", description: "", price: "", category: "", images: "" })
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudo crear el producto."))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/admin/categories")
        const json = await res.json()
        const list = Array.isArray(json?.data) ? json.data : []
        setCategories(list)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Productos</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Nuevo insumo</h1>
        <p className="mt-2 text-sm text-slate-600">Completá los datos del producto y seleccioná una categoría existente.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="id" className="block text-sm font-medium text-slate-700">ID del producto</label>
            <input id="id" name="id" value={form.id} onChange={onChange} placeholder="arc-010" className="block w-full rounded-lg border px-3 py-2" />
            <p className="text-xs text-slate-500">Opcional, pero útil para identificarlo rápido.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Precio</label>
            <input id="price" name="price" value={form.price} onChange={onChange} required type="number" min="0" className="block w-full rounded-lg border px-3 py-2" />
            <p className="text-xs text-slate-500">Ingresalo sin símbolo de moneda.</p>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required className="block w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descripción</label>
          <textarea id="description" name="description" value={form.description} onChange={onChange} required rows={4} className="block w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Subcategoría</label>
          <div className="flex gap-2">
            <select id="category" name="category" value={form.category} onChange={onChange} required className="min-h-11 flex-1 rounded-lg border px-3 py-2">
              <option value="">-- Seleccionar --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
            <a href="/admin/categorias" className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500">
              Administrar
            </a>
          </div>
          <p className="text-xs text-slate-500">Seleccioná una subcategoría válida. Las categorías principales se gestionan aparte.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="images" className="block text-sm font-medium text-slate-700">Imágenes</label>
          <input
            id="images"
            name="images"
            value={form.images}
            onChange={onChange}
            placeholder="URL1, URL2, URL3 o subí una imagen desde tu PC"
            className="block w-full rounded-lg border px-3 py-2"
          />
          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
              className="block w-full max-w-xs text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700"
            />
            {uploadingImage && <span className="text-sm text-slate-500">Subiendo...</span>}
          </div>
          <p className="text-xs text-slate-500">Separá múltiples imágenes con coma. Se guarda la primera como imagen principal.</p>
          {form.images && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.images.split(",").map((img, index) => img.trim()).filter(Boolean).slice(0, 4).map((img, index) => (
                <img key={`${img}-${index}`} src={img} alt={`Preview ${index + 1}`} className="h-16 w-16 rounded object-cover border" />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button disabled={loading || uploadingImage} className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Guardando..." : "Crear producto"}
          </button>
          {message && <div className="text-sm text-slate-700" aria-live="polite">{message}</div>}
        </div>
      </form>
    </div>
  )
}
