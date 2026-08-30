"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = pathname === "/login"

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthRoute && <Footer />}
    </div>
  )
}
