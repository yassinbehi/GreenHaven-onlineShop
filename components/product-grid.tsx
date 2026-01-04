"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart"
import { getAllProducts, getProductsByCategory, searchProducts, type Product } from "@/lib/products"
import Link from "next/link"

interface ProductGridProps {
  category?: string
  searchQuery?: string
}

export function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    let mounted = true
    async function fetchProducts() {
      if (searchQuery) {
        const results = await searchProducts(searchQuery)
        if (mounted) setProducts(results)
      } else if (category) {
        const results = await getProductsByCategory(category!)
        if (mounted) setProducts(results)
      } else {
        const results = await getAllProducts()
        if (mounted) setProducts(results)
      }
    }
    fetchProducts()
    return () => {
      mounted = false
    }
  }, [category, searchQuery])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Link href={`/produit/${product.id}`}>
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </Link>
              {product.stock < 5 && (
                <Badge className="absolute top-2 left-2" variant="destructive">
                  Peu de stock
                </Badge>
              )}
            </div>
            <div className="p-4">
              <Link href={`/produit/${product.id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">{product.name}</h3>
              </Link>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{product.price} TND</span>
                <Button size="sm" onClick={() => addToCart(product)} className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
