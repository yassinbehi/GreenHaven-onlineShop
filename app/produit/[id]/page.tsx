import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { getProductById } from "@/lib/products"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number.parseInt(id)
  const product = await getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
