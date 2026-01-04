import { NextResponse } from "next/server"
import * as ordersService from "@/lib/services/orders"

export async function GET() {
  const orders = await ordersService.getOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()
  const { customer, items } = data as any

  if (!customer || !items) return new Response(null, { status: 400 })

  const order = await ordersService.createOrder(customer, items)
  return NextResponse.json(order)
}