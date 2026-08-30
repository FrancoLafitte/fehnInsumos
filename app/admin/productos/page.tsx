"use client"

import { useEffect, useState } from "react"
import { normalizeUserMessage } from "@/lib/es-messages"

type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  category?: string | null
  image?: string | null
  in_stock?: boolean | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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

  useEffect(() => {
    fetchProducts()
  }, [])

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudo eliminar el producto")
      setMessage("Producto eliminado correctamente.")
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
        <p className="mt-2 text-sm text-slate-600">Acá podés revisar el listado activo y eliminar productos del catálogo.</p>
      </div>

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
                  <div className="text-xs text-slate-500">{product.category || "Sin categoría"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a href={`/productos/${product.id}`} className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Ver
                </a>
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
