import { NextResponse } from "next/server"
import * as ordersService from "@/lib/services/orders"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const order = await ordersService.getOrderById(id)
  if (!order) return new Response(null, { status: 404 })
  return NextResponse.json(order)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const ok = await ordersService.deleteOrder(id)
  if (!ok) return new Response(null, { status: 404 })
  return new Response(null, { status: 204 })
}