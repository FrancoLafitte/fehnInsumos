"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import supabaseBrowser from "@/lib/supabaseClientBrowser"
import { ADMIN_EMAILS, normalizeEmail } from "../../../lib/admin-config"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      if (error) throw error

      const currentUser = data.user
      const allowed = currentUser?.email ? ADMIN_EMAILS.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizeEmail(currentUser.email)) : false

      if (!allowed) {
        await supabaseBrowser.auth.signOut()
        setMessage("No tenés permisos para acceder al panel administrativo.")
        return
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setMessage(err.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <div className="w-full rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Acceso administrativo</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Solo está habilitada la cuenta del dueño del negocio.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-lg border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar al panel"}
          </button>
        </form>

        {message && <div className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div>}
      </div>
    </div>
  )
}
