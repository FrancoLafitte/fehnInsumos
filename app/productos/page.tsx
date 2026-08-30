import { Suspense } from "react"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilter } from "@/components/products/products-filter"
import supabaseServer from "@/lib/supabaseServer"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Productos | FEHN Insumos para Cerámica",
  description: "Explorá nuestro catálogo completo de insumos para cerámica con todas las categorías disponibles.",
}

interface ProductsPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categoryId = params.categoria

  const { data: mainCategoriesData } = await supabaseServer
    .from("categoriaprincipal")
    .select("id, name, description")
    .order("name", { ascending: true })

  const { data: subcategoriesData } = await supabaseServer
    .from("subcategories")
    .select("id, name, description, categoria_principal_id")
    .order("name", { ascending: true })

  const mainCategories = mainCategoriesData ?? []
  const subcategories = subcategoriesData ?? []

  const mainCategory = categoryId
    ? mainCategories.find((item) => item.id === categoryId) ?? null
    : null

  const childCategory = categoryId
    ? subcategories.find((item) => item.id === categoryId) ?? null
    : null

  const currentCategory = mainCategory ?? childCategory

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {currentCategory ? currentCategory.name : "Todos los Productos"}
        </h1>
        {currentCategory && (
          <p className="mt-2 text-muted-foreground">{currentCategory.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
            <ProductsFilter currentCategory={categoryId} />
          </Suspense>
        </aside>

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
