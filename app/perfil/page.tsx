"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabaseBrowser from "@/lib/supabaseClientBrowser"

export default function PerfilPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()

      if (!isMounted) return

      if (!session?.user) {
        router.replace("/login")
        return
      }

      setEmail(session.user.email || "")
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const updates: { email?: string; password?: string } = {}

      if (email.trim()) {
        updates.email = email.trim()
      }

      if (password.trim()) {
        updates.password = password.trim()
      }

      if (Object.keys(updates).length === 0) {
        setMessage("Cambiá al menos un campo para guardar.")
        return
      }

      const { error } = await supabaseBrowser.auth.updateUser(updates)
      if (error) throw error

      setMessage("Datos actualizados correctamente.")
      setPassword("")
    } catch (err: any) {
      setMessage(err.message || "No se pudieron actualizar los datos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Perfil</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Mi cuenta</h1>
        <p className="mt-2 text-sm text-slate-600">Podés ver y actualizar tu email y contraseña desde aquí.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar vacío para no cambiar"
            className="block w-full rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {message && <div className="text-sm text-slate-700">{message}</div>}
      </form>
    </div>
  )
}
