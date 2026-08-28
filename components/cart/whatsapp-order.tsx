"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/products"

const WHATSAPP_NUMBER = "2923523294"

export function WhatsAppOrder() {
  const { items, getTotal, clearCart } = useCart()
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

  const generateWhatsAppMessage = () => {
    let message = `Hola! Quiero hacer un pedido:\n\n`

    if (name) {
      message += `*Nombre:* ${name}\n\n`
    }

    message += `*Productos:*\n`

    items.forEach((item) => {
      message += `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}\n`
    })

    message += `\n*Total:* ${formatPrice(getTotal())}\n`

    if (notes) {
      message += `\n*Notas:* ${notes}\n`
    }

    message += `\nGracias!`

    return encodeURIComponent(message)
  }

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    window.open(whatsappUrl, "_blank")
    clearCart()
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tu nombre (opcional)</Label>
        <Input
          id="name"
          placeholder="Ej: María García"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Ej: Horario de entrega preferido, dirección, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        onClick={handleSendWhatsApp}
        className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#128C7E]"
        size="lg"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Enviar pedido por WhatsApp
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Se abrirá WhatsApp con tu pedido listo para enviar
      </p>
    </div>
  )
}