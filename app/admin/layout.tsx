"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import supabaseBrowser from "@/lib/supabaseClientBrowser"
import { ADMIN_EMAILS, normalizeEmail } from "@/lib/admin-config"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function checkAdminAccess() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()

      const isAdmin = session?.user?.email
        ? ADMIN_EMAILS.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizeEmail(session.user.email))
        : false

      if (!active) return

      if (!session || !isAdmin) {
        router.replace("/login")
        setAuthorized(false)
        setLoading(false)
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAdminAccess()

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      const isAdmin = session?.user?.email
        ? ADMIN_EMAILS.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizeEmail(session.user.email))
        : false

      if (!isAdmin) {
        router.replace("/login")
        setAuthorized(false)
        setLoading(false)
        return
      }

      setAuthorized(true)
      setLoading(false)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [pathname, router])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">Verificando acceso...</div>
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
