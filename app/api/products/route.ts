import { NextResponse } from "next/server"
import * as productsService from "@/lib/services/products"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const search = url.searchParams.get("search") || undefined
  const category = url.searchParams.get("category") || undefined

  let products
  if (search) {
    products = await productsService.searchProducts(search)
  } else if (category) {
    products = await productsService.getProductsByCategory(category)
  } else {
    products = await productsService.getAllProducts()
  }

  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const data = await request.json()
  const product = await productsService.addProduct(data as any)
  return NextResponse.json(product)
}
