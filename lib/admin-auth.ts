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
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user) {
    return null
  }

  const user = session.user

  if (!isAdminEmail(user.email)) {
    return null
  }

  return user
}
