import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Suspense } from "react"

async function SearchResults({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const query = params.q || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Résultats de recherche</h1>
      {query && <p className="text-muted-foreground mb-8">Affichage des r\u00e9sultats pour &quot;{query}&quot;</p>}
      <ProductGrid searchQuery={query} />
    </div>
  )
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
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
