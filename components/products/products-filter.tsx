"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Subcategory {
  id: string
  name: string
  description?: string
  categoriaprincipal_id?: string
}

interface CategoryGroup {
  id: string
  name: string
  description?: string
  image?: string
  subcategories: Subcategory[]
}

interface ProductsFilterProps {
  currentCategory?: string
}

export function ProductsFilter({ currentCategory }: ProductsFilterProps) {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const getParentIdFromSubcategory = (subcategory: any) =>
    subcategory?.categoria_principal_id ?? subcategory?.categoriaprincipal_id ?? null

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/public/categories")
        const json = await res.json()
        setCategories(Array.isArray(json?.data) ? json.data : [])
      } catch (error) {
        console.error("No se pudieron cargar las categorías", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!categories.length) return

    const selectedGroup = categories.find((group) => group.id === currentCategory)
    if (selectedGroup) {
      setExpandedGroup(selectedGroup.id)
      return
    }

    const selectedSubcategory = categories
      .flatMap((group) => group.subcategories)
      .find((sub) => sub.id === currentCategory)

    setExpandedGroup(selectedSubcategory ? getParentIdFromSubcategory(selectedSubcategory) : null)
  }, [categories, currentCategory])

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Categorías
      </h2>
      <nav className="flex flex-col gap-2">
        <Link
          href="/productos"
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-all",
            !currentCategory
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Todos los productos
        </Link>

        {categories.map((category) => {
          const isExpanded = expandedGroup === category.id

          return (
            <div key={category.id} className="overflow-hidden rounded-lg border border-border bg-muted/20">
              <button
                type="button"
                onClick={() => setExpandedGroup((prev) => (prev === category.id ? null : category.id))}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium transition-all",
                  currentCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted/80"
                )}
              >
                <span>{category.name}</span>
                <span className="flex items-center gap-2">
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-background/30 px-1.5 py-0.5 text-[10px] font-semibold text-current">
                    {category.subcategories.length}
                  </span>
                  <span
                    className={cn(
                      "text-xs transition-transform duration-200",
                      isExpanded ? "rotate-180" : "rotate-0"
                    )}
                  >
                    ▼
                  </span>
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-border bg-background/40 px-2 py-2">
                  {category.subcategories.length > 0 ? (
                    <div className="space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/productos?categoria=${subcategory.id}`}
                          className={cn(
                            "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                            currentCategory === subcategory.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/80">
                            {currentCategory === subcategory.id ? "✓" : ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      Sin subcategorías
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
