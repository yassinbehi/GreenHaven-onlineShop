import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { notFound } from "next/navigation"

const categoriesMap: Record<string, { display: string; slug: string }> = {
  "indoor-plants": { display: "Plantes d'Intérieur", slug: "indoor-plants" },
  "plantes-interieur": { display: "Plantes d'Intérieur", slug: "indoor-plants" },
  "outdoor-plants": { display: "Plantes d'Extérieur", slug: "outdoor-plants" },
  "plantes-exterieur": { display: "Plantes d'Extérieur", slug: "outdoor-plants" },
  accessories: { display: "Accessoires", slug: "accessories" },
  accessoires: { display: "Accessoires", slug: "accessories" },
  "care-products": { display: "Produits d'Entretien", slug: "care-products" },
  "produits-entretien": { display: "Produits d'Entretien", slug: "care-products" },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const mapping = categoriesMap[params.category]

  if (!mapping) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">{mapping.display}</h1>
          <ProductGrid category={mapping.slug} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(categoriesMap).map((category) => ({
    category,
  }))
}
