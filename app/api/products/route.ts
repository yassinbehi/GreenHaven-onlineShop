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
  try {
    const data = await request.json()

    // Protect against very large base64 payloads (avoid blowing memory and failing requests)
    const imageBase64 = (data)?.imageBase64
    if (typeof imageBase64 === "string" && imageBase64.length > 2_000_000) {
      return new Response(JSON.stringify({ error: "Image payload too large" }), { status: 413, headers: { "Content-Type": "application/json" } })
    }

    const product = await productsService.addProduct(data)
    return NextResponse.json(product)
  } catch (err) {
    // Log the error and return a JSON 500 so the client gets a proper response instead of a network failure
    // eslint-disable-next-line no-console
    console.error("/api/products POST error:", err)
    return new Response(JSON.stringify({ error: "Server error while creating product" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
