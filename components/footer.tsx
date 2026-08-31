"use client"

import Link from "next/link"

const WHATSAPP_NUMBER = "5492213141986"
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=Fehn%20Insumos%20para%20Cer%C3%A1mica&output=embed"

export function Footer() {
  return (
    <footer className="bg-[#8b5638] text-[#f9efe7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-[#f8e8d8]/20 bg-[#5a3428]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbeadf] shadow-sm">
              FEHN
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#fff7f1]">Insumos para Cerámica</h3>
            <p className="max-w-sm text-sm leading-6 text-[#f1e7dd]">
              Todo lo que necesitás para tus proyectos de cerámica artística y funcional, con asesoramiento, materiales de calidad y atención personalizada.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#f8e8d8]/20 bg-[#5a3428]/20 px-4 py-2 text-sm font-medium text-[#fff3ea] shadow-sm transition hover:bg-[#5a3428]/30"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f9efe7]">Navegación</h4>
            <ul className="space-y-3 text-sm text-[#f0e4d8]">
              <li>
                <Link href="/productos" className="transition hover:text-[#f6c99f]">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="transition hover:text-[#f6c99f]">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-[#f6c99f]">
                  Ingresar
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f9efe7]">Ubicación</h4>
            <div className="overflow-hidden rounded-2xl border border-[#5c2f22]/30 bg-[#f0e3d7]/10 shadow-[0_12px_28px_rgba(32,17,12,0.18)]">
              <iframe
                src={GOOGLE_MAPS_EMBED_URL}
                title="Ubicación de la tienda FEHN"
                className="h-48 w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[#f3e4d6] sm:flex-row sm:items-center sm:justify-between">
          <p>{new Date().getFullYear()} FEHN Insumos para Cerámica. Todos los derechos reservados.</p>
          <p>Atención personalizada • Envíos • Materiales para cerámica</p>
        </div>
      </div>
    </footer>
  )
}
