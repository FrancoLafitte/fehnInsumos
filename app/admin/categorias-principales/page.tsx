"use client"

import React, { useEffect, useState } from "react"
import { normalizeUserMessage } from "@/lib/es-messages"

type MainCategory = { id: string; name: string; description?: string; image?: string }

export default function MainCategoriesAdminPage() {
  const [categories, setCategories] = useState<MainCategory[]>([])
  const [form, setForm] = useState({ id: "", name: "", description: "", image: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/main-categories")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "No se pudieron cargar las categorías principales")
      setCategories(json.data || [])
    } catch (err: any) {
      setMsg(normalizeUserMessage(err?.message, "No se pudieron cargar las categorías principales."))
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return

    setUploadingImage(true)
    setMsg(null)

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
      setMsg("Imagen subida correctamente.")
    } catch (err: any) {
      setMsg(normalizeUserMessage(err?.message, "No se pudo subir la imagen."))
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const endpoint = editingId ? `/api/admin/main-categories/${editingId}` : "/api/admin/main-categories"
      const method = editingId ? "PATCH" : "POST"
      const body = editingId ? { name: form.name, description: form.description, image: form.image } : form

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Error al guardar la categoría principal")

      setMsg(editingId ? "Categoría principal actualizada correctamente." : "Categoría principal creada correctamente.")
      setForm({ id: "", name: "", description: "", image: "" })
      setEditingId(null)
      await fetchCategories()
    } catch (err: any) {
      setMsg(normalizeUserMessage(err?.message, "No se pudo guardar la categoría principal."))
    } finally {
      setLoading(false)
    }
  }

  function startEdit(category: MainCategory) {
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
    if (!confirm("¿Eliminar esta categoría principal?")) return

    setLoading(true)
    setMsg(null)

    try {
      const res = await fetch(`/api/admin/main-categories/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Error al eliminar la categoría principal")

      if (editingId === id) {
        setEditingId(null)
        setForm({ id: "", name: "", description: "", image: "" })
      }

      setMsg("Categoría principal eliminada correctamente.")
      await fetchCategories()
    } catch (err: any) {
      setMsg(normalizeUserMessage(err?.message, "No se pudo eliminar la categoría principal."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-orange-700">Categorías principales</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Administrar categorías principales</h2>
        <p className="mt-2 text-sm text-slate-600">Creá, editá o eliminá las categorías principales que agrupan subcategorías.</p>
      </div>

      {editingId && <div className="mb-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm">Editando <strong>{editingId}</strong></div>}

      <form onSubmit={onSubmit} className="mb-6 space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-slate-700">ID (slug)</label>
          <input
            id="id"
            name="id"
            value={form.id}
            onChange={onChange}
            required
            disabled={Boolean(editingId)}
            className="mt-1 block w-full rounded-lg border px-3 py-2 disabled:opacity-60"
          />
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
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">Imagen</label>
          <div className="mt-1 space-y-3">
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={onChange}
              placeholder="Pegá una URL o dejá este campo vacío si subís archivo"
              className="block w-full rounded-lg border px-3 py-2"
            />
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                className="block w-full max-w-xs text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-700"
              />
              {uploadingImage && <span className="text-sm text-slate-500">Subiendo...</span>}
            </div>
          </div>
          {form.image && (
            <div className="mt-3">
              <img src={form.image} alt="Preview de la categoría principal" className="h-24 w-24 rounded object-cover border" />
            </div>
          )}
        </div>

        <div>
          <button disabled={loading || uploadingImage} className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Guardando..." : editingId ? "Guardar cambios" : "Crear categoría principal"}
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
        {msg && <div className="mt-2 text-sm">{msg}</div>}
      </form>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">Categorías principales existentes</h3>
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="font-medium text-slate-900">{category.name}</div>
              <div className="text-sm text-slate-600">{category.id} • {category.description || "Sin descripción"}</div>
            </div>
            <div className="flex items-center gap-2">
              {category.image && <img src={category.image} alt={category.name} className="h-12 w-12 rounded object-cover" />}
              <button type="button" className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => startEdit(category)}>
                Editar
              </button>
              <button type="button" className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" onClick={() => removeCategory(category.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
