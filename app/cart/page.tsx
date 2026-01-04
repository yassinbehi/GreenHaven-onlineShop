import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartPage } from "@/components/cart-page"

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
