import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/indoor-garden.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Apportez la Nature Chez Vous</h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Transformez votre espace avec notre collection soigneusement sélectionnée de belles plantes d'intérieur,
          succulentes et accessoires de jardinage.
        </p>
        <Link href="/boutique">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
            Acheter Maintenant
          </Button>
        </Link>
      </div>
    </section>
  )
}
