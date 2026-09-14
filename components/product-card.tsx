"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/products"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart()
  const quantityInCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0

  return (
    <Card className="group overflow-hidden gap-0 py-0">
      <Link href={`/productos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}

          {quantityInCart > 0 && (
            <div className="absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs text-primary-foreground shadow-lg">
              <span className="font-mono font-light">{quantityInCart}</span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="text-sm font-medium text-muted-foreground">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/productos/${product.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 font-mono text-lg font-light text-foreground">
          {formatPrice(product.price)}
        </p>

        {quantityInCart > 0 && (
          <p className="mt-2 text-xs font-medium text-primary">
            En carrito: <span className="font-mono font-light">{quantityInCart}</span>
          </p>
        )}

        <Button
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          size="sm"
          className="mt-3 w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          {quantityInCart > 0 ? `Agregar otra` : "Agregar"}
        </Button>
      </CardContent>
    </Card>
  )
}
