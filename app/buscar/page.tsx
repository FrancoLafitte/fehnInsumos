import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { categories } from "@/lib/products"
import { getPublicProducts } from "@/lib/products-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Buscar productos | FEHN Insumos para Cerámica",
  description: "Buscá productos cargados por el admin en FEHN Insumos para Cerámica.",
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q?.trim() || ""
  const products = query ? await getPublicProducts() : []

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
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            ← Volver al inicio
          </Button>
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Resultados de búsqueda
        </h1>
        <p className="text-lg text-muted-foreground">
          {query ? (
            <>
              Búsqueda: <span className="font-semibold text-foreground">"{query}"</span>
            </>
          ) : (
            "Escribí un término de búsqueda para empezar"
          )}
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div>
          <p className="mb-6 text-sm text-muted-foreground">
            Se encontraron <span className="font-bold">{searchResults.length}</span> producto
            {searchResults.length !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 border-t pt-12">
            <h2 className="mb-8 text-2xl font-bold">Por categoría</h2>
            <div className="grid gap-8">
              {Array.from(new Set(searchResults.map((p) => p.category))).map((category) => {
                const categoryProducts = searchResults.filter((p) => p.category === category)
                return (
                  <div key={category}>
                    <h3 className="mb-4 text-lg font-semibold">
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
        <div className="py-12 text-center">
          <p className="mb-6 text-muted-foreground">
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
