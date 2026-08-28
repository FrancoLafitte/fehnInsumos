"use client"

import React, { useEffect, useState } from "react"

type Category = { id: string; name: string; description?: string; image?: string }

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ id: "", name: "", description: "", image: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function fetchCategories() {
    try {
      const res = await fetch("/api/public/categories")
      const json = await res.json()
      setCategories(json.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const endpoint = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories"
      const method = editingId ? "PATCH" : "POST"
      const body = editingId ? { name: form.name, description: form.description, image: form.image } : form

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Error")
      setMsg(editingId ? "Categoría actualizada" : "Categoría creada")
      setForm({ id: "", name: "", description: "", image: "" })
      setEditingId(null)
      await fetchCategories()
    } catch (err: any) {
      setMsg(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    })
    setMsg(null)
  }

  async function removeCategory(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return

    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Error")
      if (editingId === id) {
        setEditingId(null)
        setForm({ id: "", name: "", description: "", image: "" })
      }
      setMsg("Categoría eliminada")
      await fetchCategories()
    } catch (err: any) {
      setMsg(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Categorías</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Administrar categorías</h2>
        <p className="mt-2 text-sm text-slate-600">Creá, editá o eliminá categorías desde esta pantalla.</p>
      </div>

      {editingId && <div className="mb-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm">Editando <strong>{editingId}</strong></div>}

      <form onSubmit={onSubmit} className="mb-6 space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-slate-700">ID (slug)</label>
          <input id="id" name="id" value={form.id} onChange={onChange} required disabled={Boolean(editingId)} className="mt-1 block w-full rounded-lg border px-3 py-2 disabled:opacity-60" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required className="mt-1 block w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descripción</label>
          <input id="description" name="description" value={form.description} onChange={onChange} className="mt-1 block w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">Imagen (URL)</label>
          <input id="image" name="image" value={form.image} onChange={onChange} className="mt-1 block w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <button disabled={loading} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Guardando..." : editingId ? "Guardar cambios" : "Crear categoría"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-2 rounded-lg border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setEditingId(null)
                setForm({ id: "", name: "", description: "", image: "" })
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">Categorías existentes</h3>
      <ul className="space-y-3">
        {categories.map((c) => (
          <li key={c.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="font-medium text-slate-900">{c.name}</div>
              <div className="text-sm text-slate-600">{c.id} • {c.description}</div>
            </div>
            <div className="flex items-center gap-2">
              {c.image && <img src={c.image} alt={c.name} className="h-12 w-12 rounded object-cover" />}
              <button type="button" className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => startEdit(c)}>
                Editar
              </button>
              <button type="button" className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" onClick={() => removeCategory(c.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
