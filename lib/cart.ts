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
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
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

    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"))
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
  if (!res.ok) throw new Error("Order creation failed")
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
