"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/products"

interface ProductsFilterProps {
  currentCategory?: string
}

export function ProductsFilter({ currentCategory }: ProductsFilterProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Categorías</h2>
      <nav className="flex flex-col gap-1">
        <Link
          href="/productos"
          className={cn(
            "rounded-md px-3 py-2 text-sm transition-colors",
            !currentCategory
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Todos los productos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/productos?categoria=${category.id}`}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              currentCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
