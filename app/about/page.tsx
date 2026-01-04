import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Testimonials } from "@/components/testimonials"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">À propos de GreenHaven</h1>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-muted-foreground mb-6">
                Bienvenue chez GreenHaven, votre destination de confiance pour amener la nature chez vous. Fondés par une passion pour les plantes et un mode de vie durable, nous aidons les passionnés à créer des espaces verts harmonieux.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Notre collection sélectionnée avec soin comprend des plantes faciles d'entretien pour débutants ainsi que des variétés exotiques pour les jardiniers expérimentés. Nous pensons que chacun mérite de profiter des bienfaits des plantes chez soi.
              </p>
              <p className="text-lg text-muted-foreground">
                Chez GreenHaven, nous nous engageons à fournir non seulement de belles plantes, mais aussi les conseils et accessoires nécessaires pour les aider à prospérer. Notre équipe d'experts est là pour vous accompagner à chaque étape.
              </p>
            </div>
          </div>
        </div>
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
