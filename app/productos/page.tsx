import { Suspense } from "react"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilter } from "@/components/products/products-filter"
import { categories } from "@/lib/products"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos | FEHN Insumos para Cerámica",
  description: "Explorá nuestro catálogo completo de insumos para cerámica. Arcillas, esmaltes, herramientas, bizcochos, óxidos y contramoldes.",
}

interface ProductsPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categoryId = params.categoria
  const currentCategory = categoryId
    ? categories.find((c) => c.id === categoryId)
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {currentCategory ? currentCategory.name : "Todos los Productos"}
        </h1>
        {currentCategory && (
          <p className="mt-2 text-muted-foreground">
            {currentCategory.description}
          </p>
        )}
      </div>

      {/* Filters and Grid */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
            <ProductsFilter currentCategory={categoryId} />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsGrid categoryId={categoryId} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
          <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
