import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Suspense } from "react"

function SearchResults({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Résultats de recherche</h1>
      {query && <p className="text-muted-foreground mb-8">Affichage des résultats pour "{query}"</p>}
      <ProductGrid searchQuery={query} />
    </div>
  )
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Suspense fallback={<div>Chargement...</div>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
