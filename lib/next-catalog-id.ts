import supabaseServer from "@/lib/supabaseServer"

export async function getNextCatalogId(tableNames: string[]) {
  let lastError: unknown = null
  let maxId = 0
  let foundTable = false

  for (const tableName of tableNames) {
    const { data, error } = await supabaseServer.from(tableName).select("id")

    if (error) {
      lastError = error
      continue
    }

    foundTable = true
    for (const row of data ?? []) {
      const numericId = Number(row.id)
      if (Number.isSafeInteger(numericId) && numericId > maxId) {
        maxId = numericId
      }
    }
  }

  if (!foundTable) {
    throw lastError instanceof Error ? lastError : new Error("No se encontró una tabla válida para generar el ID")
  }

  return String(maxId + 1)
}
