"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Menu, X, UserRound } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ProductSearch } from "@/components/product-search"
import supabaseBrowser from "@/lib/supabaseClientBrowser"
import { ADMIN_EMAILS, normalizeEmail } from "@/lib/admin-config"

type Category = {
  id: string
  name: string
}

const FEATURED_CATEGORY_IDS = ["arcillas", "esmaltes", "de-modelado", "bases-y-fundentes", "bizcochos"]

export function Header() {
  const { getItemCount } = useCart()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [session, setSession] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemCount = getItemCount()

  useEffect(() => {
    let isMounted = true

    async function fetchCategories() {
      try {
        const res = await fetch("/api/public/categories")
        const json = await res.json()

        if (!isMounted) return

        setCategories(Array.isArray(json?.data) ? json.data : [])
      } catch (error) {
        console.error("[Header] No se pudieron cargar las categorías", error)
      }
    }

    fetchCategories()

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session)
    })

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const featuredCategories = categories
    .filter((category) => FEATURED_CATEGORY_IDS.includes(category.id))
    .concat(
      categories.filter((category) => !FEATURED_CATEGORY_IDS.includes(category.id))
    )
    .slice(0, 4)

  const isLoggedIn = Boolean(session?.user)
  const userEmail = session?.user?.email || ""
  const isAdmin = userEmail
    ? ADMIN_EMAILS.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizeEmail(userEmail))
    : false
  const userInitial = userEmail ? userEmail.trim().charAt(0).toUpperCase() : "U"

  async function handleLogout() {
    setMenuOpen(false)
    await supabaseBrowser.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#7a4c31]/20 bg-[#d79d69]/95 backdrop-blur supports-[backdrop-filter]:bg-[#d79d69]/82">
      {/* Top bar with logo, search, and cart */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-transparent sm:h-14 sm:w-14">
              <Image
                src="/images/fhenLogo.png"
                alt="Logo FEHN"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-xl font-black tracking-[0.18em] text-[#2b1b14] sm:text-2xl">
                FEHN
              </span>
              <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#6a4838] sm:block">
                Insumos para Cerámica
              </span>
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden flex-1 lg:flex lg:px-4">
            <ProductSearch />
          </div>

          {/* Cart, login and Mobile Menu */}
          <div className="flex items-center gap-2">
            {!isLoggedIn && (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden items-center gap-2 sm:inline-flex">
                  <UserRound className="h-4 w-4" />
                  Ingresá
                </Button>
              </Link>
            )}

            {isLoggedIn && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  title={userEmail}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-slate-700 hover:shadow-md hover:ring-2 hover:ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  aria-label={userEmail}
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  {userInitial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl">
                    <Link
                      href="/perfil"
                      className="block rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      Ver perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                        onClick={() => setMenuOpen(false)}
                      >
                        Panel admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#3d2418] hover:bg-[#f2d7bc]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>

        {/* Search bar for mobile - shown on mobile only */}
        <div className="pb-3 lg:hidden">
          <ProductSearch />
        </div>
      </div>

      {/* Navigation bar */}
      {pathname !== "/productos" && (
      <nav className="hidden border-t border-[#7a4c31]/25 bg-[#c98b57]/65 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <div className="hidden flex-wrap items-center justify-center gap-2 lg:flex">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground/75 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-md"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            {!isLoggedIn && (
              <Link
                href="/login"
                className="mb-2 inline-flex items-center gap-2 py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound className="h-4 w-4" />
                Ingresá
              </Link>
            )}
            <Link
              href="/productos"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos los Productos
            </Link>
            {pathname !== "/productos" && categories.map((category) => (
              <Link
                key={category.id}
                href={`/productos?categoria=${category.id}`}
                className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
