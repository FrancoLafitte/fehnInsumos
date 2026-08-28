import { notFound } from "next/navigation"
import { getCategoryById } from "@/lib/products"
import { getPublicProductById } from "@/lib/products-server"
import { ProductDetail } from "@/components/products/product-detail"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getPublicProductById(id)

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getPublicProductById(id)

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
