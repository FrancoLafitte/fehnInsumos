
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "../../lib/supabaseClientBrowser"
import { ADMIN_EMAILS, normalizeEmail } from "../../lib/admin-config"

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
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        const isAdmin = data.user?.email ? ADMIN_EMAILS.some((allowed) => normalizeEmail(allowed) === normalizeEmail(data.user?.email)) : false

        setMessage("Registro enviado: revisá tu correo para confirmar (si está habilitado).")
        if (isAdmin) {
          router.push("/admin")
          router.refresh()
        } else {
          router.push("/")
        }
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const isAdmin = data.user?.email ? ADMIN_EMAILS.some((allowed) => normalizeEmail(allowed) === normalizeEmail(data.user?.email)) : false

      setMessage("Sesión iniciada")
      router.push(isAdmin ? "/admin" : "/")
      router.refresh()
    } catch (err: any) {
      setMessage(err.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl">{isSignup ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <label className="mb-2 block">Email</label>
        <input className="mb-4 w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mb-2 block">Contraseña</label>
        <input type="password" className="mb-4 w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 px-4 py-2 text-white" disabled={loading}>
          {isSignup ? "Registrarme" : "Entrar"}
        </button>
      </form>
      <div className="mt-4">
        <button className="text-sm text-gray-600" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Ya tengo cuenta" : "Crear una cuenta"}
        </button>
      </div>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}

