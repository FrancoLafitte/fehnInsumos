import Link from "next/link"
import supabaseServer from "@/lib/supabaseServer"

export async function CategoriesSection() {
  const { data: categories } = await supabaseServer
    .from("categoriaprincipal")
    .select("id, name, description, image")
    .order("name", { ascending: true })

  const visibleCategories = (categories ?? []).slice(0, 6)

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

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/productos?categoria=${category.id}`}
              className="group block w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[#e7d7ca] bg-white shadow-[0_12px_28px_rgba(53,33,23,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(53,33,23,0.12)] sm:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]"
            >
              <div className="relative h-64 overflow-hidden bg-[#f4e7dc]">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f3d3b3] via-[#d1895d] to-[#4b2d22] text-xl font-semibold text-white">
                    {category.name}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#1f120d]/80 via-[#1f120d]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-xl font-semibold text-white">{category.name}</div>
                  {category.description && (
                    <div className="mt-1 line-clamp-2 text-xs text-white/80">{category.description}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Todas las categorías
          </Link>
        </div>
      </div>
    </section>
  )
}
