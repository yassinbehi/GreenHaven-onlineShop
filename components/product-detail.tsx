"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"
import { getCategoryLabel } from "@/lib/utils"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    // Show success message or redirect
    router.push("/boutique")
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-muted">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-96 object-cover" />
            {product.stock < 5 && (
              <Badge className="absolute top-4 left-4" variant="destructive">
                Plus que {product.stock} en stock !
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{getCategoryLabel(product.category)}</p>
          </div>

          <div className="text-3xl font-bold text-primary">{product.price} TND</div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">État du stock</h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {product.stock > 10 ? "En stock" : product.stock > 0 ? `${product.stock} restants` : "Rupture de stock"}
              </span>
            </div>
          </div>

          {product.stock > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantité</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier - {(product.price * quantity).toFixed(2)} TND
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {product.stock === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Ce produit est actuellement en rupture de stock.</p>
                <Button variant="outline" disabled>
                  Rupture de stock
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
