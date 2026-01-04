import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CTASection() {
  return (
    <section id="cta" className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-primary-foreground mb-4">Prêt à commencer votre aventure botanique ?</h2>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté de passionnés de plantes et obtenez 10% de réduction sur votre première commande en vous abonnant à notre newsletter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
          <Input placeholder="Entrez votre e-mail" className="bg-white text-foreground" />
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">Obtenez -10%</Button>
        </div>

        <Button
          size="lg"
          variant="outline"
          className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
        >
          Parcourir toutes les plantes
        </Button>
      </div>
    </section>
  )
}
