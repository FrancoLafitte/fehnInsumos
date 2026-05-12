import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Taller de cerámica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-xl">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Todo para tu arte en cerámica
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/90">
            Arcillas, esmaltes, herramientas y todo lo que necesitás para crear
            piezas únicas. Calidad profesional para artistas y aficionados.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/productos">
                Ver Productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
              <Link href="#categorias">
                Explorar Categorías
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
