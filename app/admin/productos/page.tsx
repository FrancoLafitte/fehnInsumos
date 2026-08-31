"use client"

import { useEffect, useState } from "react"
import { normalizeUserMessage } from "@/lib/es-messages"

type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  category?: string | null
  subcategory?: string | null
  image?: string | null
  in_stock?: boolean | null
}

type SubcategoryOption = {
  id: string
  name: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    subcategory: "",
    image: "",
  })
  const [message, setMessage] = useState<string | null>(null)

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

      setForm((s) => ({ ...s, image: json.url }))
      setMessage("Imagen subida correctamente.")
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudo subir la imagen."))
    } finally {
      setUploadingImage(false)
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Error al cargar productos")
      setProducts(json.data || [])
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudieron cargar los productos."))
    }
  }

  async function fetchSubcategories() {
    try {
      const res = await fetch("/api/admin/categories")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudieron cargar las subcategorías")
      setSubcategories(Array.isArray(json.data) ? json.data : [])
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudieron cargar las subcategorías."))
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSubcategories()
  }, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      subcategory: product.subcategory || product.category || "",
      image: product.image || "",
    })
    setMessage(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          subcategory: form.subcategory || null,
          image: form.image || null,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudo actualizar el producto")

      setMessage("Producto actualizado correctamente.")
      setEditingId(null)
      setForm({ id: "", name: "", description: "", price: "", subcategory: "", image: "" })
      await fetchProducts()
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudo actualizar el producto."))
    } finally {
      setLoading(false)
    }
  }

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudo eliminar el producto")
      setMessage("Producto eliminado correctamente.")
      if (editingId === id) {
        setEditingId(null)
        setForm({ id: "", name: "", description: "", price: "", subcategory: "", image: "" })
      }
      await fetchProducts()
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "No se pudo eliminar el producto."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-red-700">Productos</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Gestionar productos</h1>
        <p className="mt-2 text-sm text-slate-600">Acá podés editar, revisar y eliminar productos del catálogo.</p>
      </div>

      {editingId && (
        <form onSubmit={onSubmit} className="mb-6 space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Editar producto</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
            <input id="name" name="name" value={form.name} onChange={onChange} required className="mt-1 block w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea id="description" name="description" value={form.description} onChange={onChange} rows={4} className="mt-1 block w-full rounded-lg border px-3 py-2" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">Precio</label>
              <input id="price" name="price" type="number" min="0" value={form.price} onChange={onChange} required className="mt-1 block w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-slate-700">Subcategoría</label>
              <select id="subcategory" name="subcategory" value={form.subcategory} onChange={onChange} className="mt-1 block w-full rounded-lg border px-3 py-2">
                <option value="">Sin subcategoría</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700">Imagen</label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={onChange}
              placeholder="URL de la imagen o subí una desde tu PC"
              className="mt-1 block w-full rounded-lg border px-3 py-2"
            />
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                className="block w-full max-w-xs text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-700"
              />
              {uploadingImage && <span className="text-sm text-slate-500">Subiendo...</span>}
            </div>
            {form.image && (
              <div className="mt-3">
                <img src={form.image} alt="Previsualización" className="h-20 w-20 rounded object-cover border" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading || uploadingImage} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm({ id: "", name: "", description: "", price: "", subcategory: "", image: "" })
              }}
              className="rounded-lg border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {message && <div className="mb-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</div>}

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-600 shadow-sm">No hay productos cargados.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">Sin imagen</div>
                )}
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-600">{product.id} • ${Number(product.price).toLocaleString("es-AR")}</div>
                  <div className="text-xs text-slate-500">{product.subcategory || product.category || "Sin categoría"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => removeProduct(product.id)}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
