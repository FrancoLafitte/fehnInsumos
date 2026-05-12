"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/products"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
  categoryName?: string
}

export function ProductDetail({ product, categoryName }: ProductDetailProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/productos"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="text-lg font-medium text-muted-foreground">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {categoryName && (
            <Link
              href={`/productos?categoria=${product.category}`}
              className="mb-2 text-sm text-primary hover:underline"
            >
              {categoryName}
            </Link>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-foreground">Descripción</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Availability */}
          <div className="mt-6">
            <p className={product.inStock ? "text-green-600" : "text-destructive"}>
              {product.inStock ? "En stock" : "Sin stock"}
            </p>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-foreground">Cantidad</h2>
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Disminuir cantidad</span>
                </Button>
                <span className="w-12 text-center text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Aumentar cantidad</span>
                </Button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || added}
              size="lg"
              className="w-full gap-2 sm:w-auto"
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  Agregado al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al carrito
                </>
              )}
            </Button>
          </div>

          {/* Subtotal */}
          {product.inStock && quantity > 1 && (
            <p className="mt-4 text-sm text-muted-foreground">
              Subtotal: {formatPrice(product.price * quantity)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
