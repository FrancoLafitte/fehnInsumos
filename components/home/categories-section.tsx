import Link from "next/link"
import { CATEGORY_GROUPS } from "@/lib/category-groups"

export async function CategoriesSection() {
  return (
    <section id="categorias" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nuestras Categorías
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Encontrá todo lo que necesitás para tus proyectos de cerámica
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {group.name}
              </div>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/productos?categoria=${item.id}`}
                    className="block rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground/80 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Todos los productos
          </Link>
        </div>
      </div>
    </section>
  )
}
