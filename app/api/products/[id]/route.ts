import { NextResponse } from "next/server"
import * as productsService from "@/lib/services/products"

type ProductUpdatePayload = Partial<{
  name: string
  price: number
  category: string
  stock: number
  description: string
  image: string
  imageBase64?: string
  imageName?: string
  imageContentType?: string
}>

// GET product (exclude binary imageData from JSON response)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (Number.isNaN(id)) return new Response(null, { status: 400 })

  const product = await productsService.getProductById(id)
  if (!product) return new Response(null, { status: 404 })

  const response = {
    ...product,
    imageData: undefined,
    image: product.image ? `/api/products/${id}/image` : product.image,
  }

  return NextResponse.json(response)
}

// PUT update product (supports imageBase64 uploads)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (Number.isNaN(id)) return new Response(null, { status: 400 })

  const data = (await request.json()) as ProductUpdatePayload
  const updated = await productsService.updateProduct(id, data)
  if (!updated) return new Response(null, { status: 404 })
  return NextResponse.json({ ...updated })
}

// DELETE product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (Number.isNaN(id)) return new Response(null, { status: 400 })

  const ok = await productsService.deleteProduct(id)
  if (!ok) return new Response(null, { status: 404 })
  return new Response(null, { status: 204 })
}
