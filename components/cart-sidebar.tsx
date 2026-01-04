"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { getCart, updateCartQuantity, removeFromCart, getCartTotalWithTransport, type CartItem } from "@/lib/cart"
import { CheckoutForm } from "./checkout-form"

export function CartSidebar() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    // Load initial cart
    setCart(getCart())

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCart(getCart())
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const { subtotal } = getCartTotalWithTransport()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
  }

  const handleCheckoutSuccess = () => {
    setShowCheckout(false)
    setIsOpen(false)
  }

  if (showCheckout) {
    return (
      <CheckoutForm
        cart={cart}
        total={subtotal}
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Panier ({itemCount} articles)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="font-bold text-primary">{item.price} TND</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-transparent"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Sous-total :</span>
                <span className="text-2xl font-bold text-primary">{subtotal.toFixed(2)} TND</span>
              </div>
              <p className="text-sm text-muted-foreground">Frais de transport calculés lors de la commande</p>
              <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                Commander (Paiement à la livraison)
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
