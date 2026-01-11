import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center bg-card p-12 rounded-lg border">
            <h1 className="text-4xl font-bold mb-4">Contact</h1>
            <p className="text-lg text-muted-foreground mb-6">Cette fonctionnalité est en cours de création.</p>
            <p className="text-sm">Pour toute question urgente, contactez-nous à <a href="mailto:hello@greenhaven.tn" className="text-primary">hello@greenhaven.tn</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
