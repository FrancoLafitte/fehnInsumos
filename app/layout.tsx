import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FEHN | Insumos para Cerámica',
  description: 'Tu tienda de insumos para cerámica con catálogo completo por categorías. Enviamos a todo el país.',
  keywords: ['cerámica', 'arcilla', 'esmaltes', 'herramientas cerámica', 'categorías cerámica', 'catálogo cerámica'],
  generator: 'v0.app',
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/fhenLogo.png',
    apple: '/images/fhenLogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
