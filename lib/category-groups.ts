export type CategoryEntry = {
  id: string
  name: string
  description?: string
  image?: string
}

export type CategoryGroup = {
  id: string
  name: string
  items: Array<{ id: string; name: string; description?: string; image?: string }>
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "materias-primas",
    name: "Materias Primas",
    items: [
      { id: "arcillas", name: "Arcillas" },
      { id: "barbotinas", name: "Barbotinas" },
    ],
  },
  {
    id: "color-y-acabados",
    name: "Color y Acabados",
    items: [
      { id: "esmaltes", name: "Esmaltes" },
      { id: "engobes", name: "Engobes" },
      { id: "pigmentos", name: "Pigmentos" },
      { id: "oxidos", name: "Óxidos" },
    ],
  },
  {
    id: "herramientas-y-accesorios",
    name: "Herramientas y Accesorios",
    items: [
      { id: "de-modelado", name: "De Modelado" },
      { id: "cortantes", name: "Cortantes" },
      { id: "texturas-y-moldes", name: "Texturas y moldes" },
    ],
  },
  {
    id: "quimica-y-formulas",
    name: "Química y Fórmulas",
    items: [{ id: "bases-y-fundentes", name: "Bases y Fundentes" }],
  },
  {
    id: "bizcochos",
    name: "Bizcochos",
    items: [
      { id: "vajillas", name: "Vajillas" },
      { id: "decoracion", name: "Decoración" },
      { id: "utilitarios", name: "Utilitarios" },
      { id: "otros", name: "Otros" },
    ],
  },
]

function normalizeCategoryName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function getOrderedCategories(categories: CategoryEntry[]) {
  const lookup = new Map(
    categories.map((category) => [normalizeCategoryName(category.name), category])
  )

  return CATEGORY_GROUPS.flatMap((group) =>
    group.items.map((item) => {
      const match =
        categories.find((category) => category.id === item.id) ||
        lookup.get(normalizeCategoryName(item.name)) ||
        { ...item, id: item.id, name: item.name }

      return {
        id: match.id,
        name: match.name,
        description: match.description || group.name,
        image: match.image || "",
      }
    })
  )
}

export function getGroupedCategories(categories: CategoryEntry[]) {
  return CATEGORY_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const match =
        categories.find((category) => category.id === item.id) ||
        categories.find(
          (category) => normalizeCategoryName(category.name) === normalizeCategoryName(item.name)
        ) ||
        { ...item }

      return {
        id: match.id,
        name: match.name,
        description: match.description || group.name,
        image: match.image || "",
      }
    }),
  }))
}
