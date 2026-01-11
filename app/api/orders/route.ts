import { NextResponse } from "next/server"
import * as ordersService from "@/lib/services/orders"

export async function GET() {
  try {
    const orders = await ordersService.getOrders()
    return NextResponse.json(orders)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/orders GET error:", err)
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data?.customer || !Array.isArray(data?.items) || data.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload: customer and items are required" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    // Protect against abusive payload sizes
    const payloadStr = JSON.stringify(data)
    if (payloadStr.length > 2_000_000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413, headers: { "Content-Type": "application/json" } })
    }

    const order = await ordersService.createOrder(data.customer, data.items)
    return NextResponse.json(order)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/orders POST error:", err)
    return new Response(JSON.stringify({ error: (err as Error).message || "Failed to create order" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}