"use client"

import { products, formatPrice } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FeaturedProducts() {
  // Get first 8 products that are in stock
  const featuredProducts = products.filter((p) => p.inStock).slice(0, 8)

  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Productos Destacados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Los más elegidos por nuestros clientes
            </p>
          </div>
          <Button asChild variant="outline" className="hidden gap-2 sm:flex">
            <Link href="/productos">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/productos">
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
