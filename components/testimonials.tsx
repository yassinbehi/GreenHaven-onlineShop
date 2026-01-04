import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Benali",
    text: "Plantes de qualité exceptionnelle ! Mon Monstera est arrivé parfaitement emballé et prospère dans mon salon.",
    rating: 5,
    image: "/happy-woman-plants.png",
  },
  {
    id: 2,
    name: "Ahmed Trabelsi",
    text: "Excellent service client et plantes saines. Les instructions d'entretien étaient très utiles pour un débutant comme moi.",
    rating: 5,
    image: "/placeholder-t1gno.png",
  },
  {
    id: 3,
    name: "Leila Mansouri",
    text: "J'ai commandé plusieurs fois et chaque plante était parfaite. Livraison rapide et emballage excellent !",
    rating: 5,
    image: "/smiling-woman-plants.png",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-xl text-muted-foreground">Rejoignez des milliers de parents de plantes heureux</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="font-semibold text-foreground">{testimonial.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
