import type { Metadata } from "next"
import { CartContent } from "@/components/cart/cart-content"

export const metadata: Metadata = {
  title: "Carrito | FEHN Insumos para Cerámica",
  description: "Tu carrito de compras en FEHN Insumos para Cerámica.",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Tu Carrito
      </h1>
      <CartContent />
    </div>
  )
}
