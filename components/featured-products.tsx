"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { addToCart } from "@/lib/cart"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    price: 45.99,
    image: "/plants/monstera.png",
    description: "Parfait pour les débutants",
    category: "Plantes d'Intérieur",
  },
]

export function FeaturedProducts() {
  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  return (
    <section id="featured-products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Plantes Vedettes</h2>
          <p className="text-xl text-muted-foreground">
            Découvrez nos plantes les plus populaires, parfaites pour toute maison
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Link href={`/produit/${product.id}`}>
                  <div className="aspect-square overflow-hidden rounded-t-lg cursor-pointer">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/produit/${product.id}`}>
                    <h3 className="font-semibold text-lg text-foreground mb-1 hover:text-primary cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price} TND</span>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => handleAddToCart(product)}
                    >
                      Ajouter au Panier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
