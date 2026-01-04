import { prisma } from "@/lib/prisma"
import type { CartItem } from "@/lib/cart"

export interface OrderRecord {
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
  paymentMethod: string
  date: string
}

export async function createOrder(customer: OrderRecord["customer"], items: CartItem[]) {
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const transportFee = 8
  const total = subtotal + transportFee
  const id = `ORD-${Date.now()}`

  const record = await prisma.order.create({
    data: {
      id,
      // customer and items stored as JSON
      customer: customer as unknown as object,
      items: items as unknown as object,
      subtotal,
      transportFee,
      total,
      status: "pending",
      paymentMethod: "COD",
    },
  })

  return {
    id: record.id,
    customer: record.customer as unknown as OrderRecord['customer'],
    items: record.items as unknown as CartItem[],
    subtotal: record.subtotal,
    transportFee: record.transportFee,
    total: record.total,
    status: record.status as unknown as OrderRecord['status'],
    paymentMethod: record.paymentMethod,
    date: record.date.toISOString().split("T")[0],
  } as OrderRecord
}

export async function getOrders() {
  const rows = await prisma.order.findMany({ orderBy: { date: "desc" } })
  return rows.map((r) => ({
    id: r.id,
    customer: r.customer as unknown as OrderRecord['customer'],
    items: r.items as unknown as CartItem[],
    subtotal: r.subtotal,
    transportFee: r.transportFee,
    total: r.total,
    status: r.status as unknown as OrderRecord['status'],
    paymentMethod: r.paymentMethod,
    date: r.date.toISOString().split("T")[0],
  })) as OrderRecord[]
}

export async function getOrderById(id: string) {
  const r = await prisma.order.findUnique({ where: { id } })
  if (!r) return null
  return {
    id: r.id,
    customer: r.customer as unknown as OrderRecord['customer'],
    items: r.items as unknown as CartItem[],
    subtotal: r.subtotal,
    transportFee: r.transportFee,
    total: r.total,
    status: r.status as unknown as OrderRecord['status'],
    paymentMethod: r.paymentMethod,
    date: r.date.toISOString().split("T")[0],
  } as OrderRecord
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}