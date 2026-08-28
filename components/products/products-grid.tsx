import { getPublicProducts } from "@/lib/products-server"
import { ProductCard } from "@/components/product-card"

interface ProductsGridProps {
  categoryId?: string
}

export async function ProductsGrid({ categoryId }: ProductsGridProps) {
  const filteredProducts = await getPublicProducts(categoryId)

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">
          No hay productos en esta categoría.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
