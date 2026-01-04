import { Leaf, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">GreenHaven</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Votre partenaire de confiance pour apporter la nature chez vous. Nous proposons des plantes de qualité et des conseils d'entretien experts pour
              vous aider à créer votre espace vert idéal.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="/boutique" className="text-muted-foreground hover:text-primary transition-colors">
                  Boutique
                </a>
              </li>
              <li>
                <a href="/a-propos" className="text-muted-foreground hover:text-primary transition-colors">
                  Guide d'entretien
                </a>
              </li>
              <li>
                <a href="/a-propos" className="text-muted-foreground hover:text-primary transition-colors">
                  À Propos
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Service client</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Livraison
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Retours
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Assistance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2026 GreenHaven. Tous droits réservés. Construit avec 🌱 pour les amoureux des plantes.
          </p>
        </div>
      </div>
    </footer>
  )
}
