"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ProductSearch } from "@/components/product-search"
import { categories } from "@/lib/products"

export function Header() {
  const { getItemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar with logo, search, and cart */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              FEHN
            </span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Insumos para Cerámica
            </span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden flex-1 lg:flex lg:px-4">
            <ProductSearch />
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
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
              className="lg:hidden"
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
      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/productos"
            className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Todos los Productos
          </Link>
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/productos?categoria=${category.id}`}
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/productos"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos los Productos
            </Link>
            {categories.map((category) => (
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
