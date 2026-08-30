
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "../../lib/supabaseClientBrowser"
import { ADMIN_EMAILS, normalizeEmail } from "../../lib/admin-config"
import { normalizeUserMessage } from "../../lib/es-messages"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSignup, setIsSignup] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError

        const isAdmin = (signInData.user?.email ? ADMIN_EMAILS.some((allowed) => normalizeEmail(allowed) === normalizeEmail(signInData.user?.email)) : false)

        setMessage("Cuenta creada correctamente. Ya estás logueado.")
        router.push(isAdmin ? "/admin" : "/")
        router.refresh()
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const isAdmin = data.user?.email ? ADMIN_EMAILS.some((allowed) => normalizeEmail(allowed) === normalizeEmail(data.user?.email)) : false

      setMessage("Sesión iniciada")
      router.push(isAdmin ? "/admin" : "/")
      router.refresh()
    } catch (err: any) {
      setMessage(normalizeUserMessage(err?.message, "Ocurrió un error al iniciar sesión."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,130,78,0.15),transparent_35%),linear-gradient(180deg,#f8f5f1_0%,#fff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-[#d99267]/30 bg-[#fcefe7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a4d2a]">
              FEHN Insumos
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {isSignup ? "Creá tu cuenta para comprar" : "Ingresá a tu cuenta"}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Encontrá materiales, herramientas y acabados para cerámica con una experiencia simple y directa.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="text-2xl font-bold text-[#8a4d2a]">+500</div>
                <div className="mt-1 text-sm text-slate-600">productos</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="text-2xl font-bold text-[#8a4d2a]">4.9</div>
                <div className="mt-1 text-sm text-slate-600">calificación</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="text-2xl font-bold text-[#8a4d2a]">24h</div>
                <div className="mt-1 text-sm text-slate-600">envío rápido</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4d2a]">
                {isSignup ? "Registro" : "Acceso"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                {isSignup ? "Crear cuenta" : "Iniciar sesión"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#c77a55] focus:bg-white focus:ring-2 focus:ring-[#f1d3c2]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#c77a55] focus:bg-white focus:ring-2 focus:ring-[#f1d3c2]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#a76a45] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f5639] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (isSignup ? "Creando cuenta..." : "Ingresando...") : isSignup ? "Registrarme" : "Entrar"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-600">
              <span>{isSignup ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}</span>
              <button
                type="button"
                className="font-semibold text-[#8a4d2a] transition hover:text-[#734226]"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Iniciá sesión" : "Crear una cuenta"}
              </button>
            </div>

            {message && (
              <div className="mt-5 rounded-xl border border-[#f1d3c2] bg-[#fff8f3] px-3 py-2 text-sm text-[#7c4327]">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

