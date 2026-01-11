"use client"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

export interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
  }
  items: CartItem[]
  subtotal: number
  transportFee: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentMethod: "COD"
  date: string
}

// Cart management functions
export function getCart(): CartItem[] {
  if (typeof window !== "undefined") {
    try {
      const cart = localStorage.getItem("cart")
      return cart ? JSON.parse(cart) : []
    } catch (err) {
      // If parsing fails (corrupted storage) clear the cart and return empty
      // eslint-disable-next-line no-console
      console.warn("getCart: failed to parse localStorage cart, clearing:", err)
      try {
        localStorage.removeItem("cart")
      } catch {
        // ignore
      }
      return []
    }
  }
  return []
}

export function addToCart(product: Omit<CartItem, "quantity">): void {
  if (typeof window !== "undefined") {
    const cart = getCart()
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    // Try to persist; if quota exceeded, evict oldest items until it fits (best-effort)
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent("cartUpdated"))
      return
    } catch (err) {
      // If it's a quota error, try to evict oldest items
      // eslint-disable-next-line no-console
      console.warn("addToCart: save failed, attempting eviction:", err)

      // Best-effort: remove oldest items up to 5 times or until save succeeds
      let evictAttempts = 0
      while (evictAttempts < 5 && cart.length > 0) {
        cart.shift() // remove oldest
        try {
          localStorage.setItem("cart", JSON.stringify(cart))
          window.dispatchEvent(new CustomEvent("cartUpdated"))
          // Inform the user that we had to drop items
          alert("Le panier est trop volumineux : certains articles ont été supprimés pour libérer de l'espace.")
          return
        } catch {
          evictAttempts += 1
          // continue loop
        }
      }

      // Final fallback: try sessionStorage
      try {
        sessionStorage.setItem("cart", JSON.stringify(cart))
        window.dispatchEvent(new CustomEvent("cartUpdated"))
        alert("Le panier a été sauvegardé en session (mémoire temporaire) car l'espace local est plein.")
        return
      } catch (e) {
        // last resort: inform user and do not persist
        // eslint-disable-next-line no-console
        console.error("Failed to persist cart to any storage:", e)
        alert("Impossible de sauvegarder le panier : l'espace de stockage est plein.")
        return
      }
    }
  }
}

export function removeFromCart(productId: number): void {
  if (typeof window !== "undefined") {
    const cart = getCart().filter((item) => item.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }
}

export function updateCartQuantity(productId: number, quantity: number): void {
  if (typeof window !== "undefined") {
    const cart = getCart()
    const item = cart.find((item) => item.id === productId)

    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        localStorage.setItem("cart", JSON.stringify(cart))
        window.dispatchEvent(new CustomEvent("cartUpdated"))
      }
    }
  }
}

export function clearCart(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart")
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0)
}

/*export function calculateTransportFee(city: string, subtotal: number): number {
  const normalizedCity = city.toLowerCase().trim()

  // Standard delivery fees by region
  if (
    normalizedCity.includes("tunis") ||
    normalizedCity.includes("ariana") ||
    normalizedCity.includes("ben arous") ||
    normalizedCity.includes("manouba")
  ) {
    return 15 // Greater Tunis area
  }

  if (
    normalizedCity.includes("sousse") ||
    normalizedCity.includes("monastir") ||
    normalizedCity.includes("mahdia") ||
    normalizedCity.includes("sfax")
  ) {
    return 25 // Coastal cities
  }

  return 35 // Other regions
}*/

export function getCartTotalWithTransport(): {
  subtotal: number
  transportFee: number
  total: number
} {
  const subtotal = getCartTotal()
  const transportFee = 8
  return {
    subtotal,
    transportFee,
    total: subtotal + transportFee,
  }
}

// Order management (client-facing: call API endpoints)

export async function createOrder(customerInfo: Order["customer"]): Promise<Order> {
  const cart = getCart()
  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0)
  const transportFee = 8
  const total = subtotal + transportFee

  const payload = {
    customer: customerInfo,
    items: cart,
    subtotal,
    transportFee,
    total,
  }

  const res = await fetch(`/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  if (!res.ok) {
    let msg = `Order creation failed: ${res.status}`
    try {
      const body = await res.json()
      if (body?.error) msg = body.error
    } catch {
      // ignore parse errors
    }
    throw new Error(msg)
  }

  const order = await res.json()

  // Clear cart after successful creation
  clearCart()

  return order
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`/api/orders`)
  if (!res.ok) return []
  return res.json()
}

// React hook for cart management
import { useState, useEffect } from "react"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

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

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal: () => getCartTotal(),
    getCartTotalWithTransport,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  }
}
