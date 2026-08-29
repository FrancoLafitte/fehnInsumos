import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { isAdminEmail } from "./admin-config"

export async function requireAdminSession() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op in read-only checks.
        },
      },
    },
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  if (!isAdminEmail(user.email)) {
    return null
  }

  return user
}
