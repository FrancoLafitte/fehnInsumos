import Link from "next/link"

export default function AdminIndexPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Panel de administración</p>
        <h1 className="mt-2 text-3xl font-semibold">Elegí qué querés administrar</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Desde acá podés cargar productos, organizar categorías y mantener el catálogo ordenado sin salir del panel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <Link
            href="/admin/productos/nuevo"
            className="group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <div className="text-sm font-medium uppercase tracking-wide text-sky-700">Productos</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">Agregar producto</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Cargar nombre, precio, categoría e imágenes para publicar un nuevo insumo.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-sky-700 group-hover:underline">Ir al formulario</span>
          </Link>

          <Link
            href="/admin/productos"
            className="group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <div className="text-sm font-medium uppercase tracking-wide text-red-700">Productos</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">Gestionar productos</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Revisá el catálogo y eliminá productos que ya no estén disponibles.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-red-700 group-hover:underline">Ver catálogo</span>
          </Link>
        </div>

        <Link
          href="/admin/categorias"
          className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <div className="text-sm font-medium uppercase tracking-wide text-emerald-700">Categorías</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">Gestionar categorías</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Crear, editar o eliminar categorías para mantener ordenado el catálogo.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-emerald-700 group-hover:underline">Abrir gestión</span>
        </Link>
      </div>
    </div>
  )
}
