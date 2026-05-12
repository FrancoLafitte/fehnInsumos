"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"

export function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof products>([])
  const router = useRouter()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)

    if (query.trim().length === 0) {
      setSuggestions([])
      return
    }

    const queryLower = query.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower)
    )

    setSuggestions(filtered.slice(0, 5))
    setIsOpen(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setSuggestions([])
      setIsOpen(false)
    }
  }

  const handleSelectProduct = (productId: string) => {
    router.push(`/productos/${productId}`)
    setSearchQuery("")
    setSuggestions([])
    setIsOpen(false)
  }

  const handleClear = () => {
    setSearchQuery("")
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors border-b last:border-b-0 flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {product.description.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-primary font-semibold mt-1">
                    ${product.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t p-2 text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSubmit}
              className="text-xs w-full"
            >
              Ver todos los resultados para "{searchQuery}"
            </Button>
          </div>
        </div>
      )}

      {isOpen && searchQuery && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 p-4">
          <div className="text-sm text-muted-foreground text-center">
            No se encontraron productos
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSubmit}
            className="text-xs w-full mt-2"
          >
            Buscar de todas formas
          </Button>
        </div>
      )}
    </div>
  )
}
