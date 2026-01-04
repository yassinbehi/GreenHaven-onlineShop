import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Scissors, Droplets, Sun } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: 1,
    slug: "plantes-interieur",
    name: "Plantes d'Intérieur",
    description: "Parfaites pour votre maison",
    icon: Leaf,
    image: "/indoor.JPG",
    count: "25+ plantes",
  },
  {
    id: 2,
    slug: "accessoires",
    name: "Accessoires",
    description: "Pots, outils et produits d'entretien",
    icon: Scissors,
    image: "/pots.png",
    count: "50+ articles",
  },
  {
    id: 3,
    slug: "produits-entretien",
    name: "Produits d'Entretien",
    description: "Engrais et nutriments",
    icon: Droplets,
    image: "/fertilizer.jpg",
    count: "15+ produits",
  },
  {
    id: 4,
    slug: "plantes-exterieur",
    name: "Plantes d'Extérieur",
    description: "Plantes de jardin et terrasse",
    icon: Sun,
    image: "/outdoor.jpg",
    count: "30+ plantes",
  },
]

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Acheter par Catégorie</h2>
          <p className="text-xl text-muted-foreground">Trouvez exactement ce que vous cherchez</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl text-foreground mb-2">{category.name}</h3>
                      <p className="text-muted-foreground mb-3">{category.description}</p>
                      <p className="text-sm text-primary font-medium">{category.count}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
