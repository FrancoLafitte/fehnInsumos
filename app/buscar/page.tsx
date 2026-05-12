"use client"

import { useSearchParams } from "next/navigation"
import { products, categories } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const searchResults = query
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            ← Volver al inicio
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-lg text-muted-foreground">
          {query && (
            <>
              Búsqueda: <span className="font-semibold text-foreground">"{query}"</span>
            </>
          )}
        </p>
      </div>

      {/* Results */}
      {searchResults.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            Se encontraron <span className="font-bold">{searchResults.length}</span> producto
            {searchResults.length !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Group by category */}
          <div className="mt-12 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Por categoría</h2>
            <div className="grid gap-8">
              {Array.from(new Set(searchResults.map((p) => p.category))).map((category) => {
                const categoryProducts = searchResults.filter((p) => p.category === category)
                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-4">
                      {getCategoryName(category)} ({categoryProducts.length})
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">
            {query
              ? `No se encontraron productos que coincidan con "${query}"`
              : "Ingresa un término de búsqueda para comenzar"}
          </p>
          <Link href="/productos">
            <Button>Ver todos los productos</Button>
          </Link>
        </div>
      )}
    </main>
  )
}
