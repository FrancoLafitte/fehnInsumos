import { notFound } from "next/navigation"
import { getProductById, getCategoryById, formatPrice, products } from "@/lib/products"
import { ProductDetail } from "@/components/products/product-detail"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    return {
      title: "Producto no encontrado | FEHN",
    }
  }

  return {
    title: `${product.name} | FEHN Insumos para Cerámica`,
    description: product.description,
  }
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const category = getCategoryById(product.category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail product={product} categoryName={category?.name} />
    </div>
  )
}
