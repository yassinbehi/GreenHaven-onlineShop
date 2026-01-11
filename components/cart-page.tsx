"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart, getCartTotalWithTransport } from "@/lib/cart";
import { CheckoutForm } from "./checkout-form";
import Link from "next/link";
import Image from "next/image";

export function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  

  const { subtotal, transportFee, total } = getCartTotalWithTransport();

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
  };

  if (showCheckout) {
    return (
      <CheckoutForm
        cart={cart}
        total={subtotal}
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/boutique">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Panier</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-8">
            Ajoutez des plantes magnifiques pour commencer !
          </p>
          <Link href="/boutique">
            <Button size="lg">Continuer vos achats</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground capitalize mb-2">
                        {item.category.replace("-", " ")}
                      </p>
                      <p className="font-bold text-primary text-lg">
                        {item.price} TND
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Sous-total (
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      articles)
                    </span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de transport</span>
                    <span>{transportFee.toFixed(2)} TND</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)} TND</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  Passer à la caisse
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>• Paiement à la livraison</p>
                  <p>• Emballage sécurisé garanti</p>
                  <p>• Les frais de livraison standard s&apos;appliquent</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
