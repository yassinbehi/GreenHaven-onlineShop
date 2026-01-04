"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, Truck } from "lucide-react"
import { createOrder, type CartItem, getCartTotalWithTransport } from "@/lib/cart"

interface CheckoutFormProps {
  cart: CartItem[]
  total: number
  onBack: () => void
  onSuccess: () => void
}

export function CheckoutForm({ cart, onBack, onSuccess }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [totals, setTotals] = useState({ subtotal: 0, transportFee: 0, total: 0 })

  useEffect(() => {
    const newTotals = getCartTotalWithTransport(formData.city)
    setTotals(newTotals)
  }, [formData.city])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const order = await createOrder(formData)
      setOrderId(order.id)
      setOrderComplete(true)
    } catch (error) {
      console.error("Order creation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Commande confirmée !</h2>
            <p className="text-muted-foreground mb-4">Votre commande #{orderId} a été enregistrée avec succès.</p>
            <Alert className="mb-6">
              <AlertDescription>
                Vous paierez <strong>{totals.total.toFixed(2)} TND</strong> en espèces à la livraison.
              </AlertDescription>
            </Alert>
            <Button onClick={onSuccess} className="w-full">
              Continuer vos achats
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Paiement</h1>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total :</span>
                    <span>{totals.subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Frais de transport :</span>
                    </div>
                    <span className={totals.transportFee === 0 ? "text-green-600 font-medium" : ""}>
                      {totals.transportFee === 0 ? "GRATUIT" : `${totals.transportFee.toFixed(2)} TND`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total :</span>
                    <span>{totals.total.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="ex. Tunis, Sousse, Sfax"
                    required
                  />
                  {formData.city && totals.transportFee === 0 && totals.subtotal >= 100 && (
                    <p className="text-sm text-green-600">🎉 Livraison gratuite pour les commandes de plus de 100 TND en Grand Tunis !</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Entrez votre adresse complète"
                    required
                    rows={3}
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Méthode de paiement :</strong> Paiement à la livraison (Cash à la livraison)
                    <br />
                    Vous paierez {totals.total.toFixed(2)} TND en espèces à la livraison.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi de la commande..." : `Passer la commande - ${totals.total.toFixed(2)} TND`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
