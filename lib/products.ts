// Provide unified product API for server and client.
// On the server we use direct Prisma-backed services. On the client we call the API routes.
import * as server from "@/lib/services/products"

export type Product = server.Product

export type ProductCreate = Omit<Product, "id" | "createdAt" | "updatedAt">
export type ProductUpdate = Partial<Omit<Product, "createdAt" | "updatedAt">> & { id: number }

const isServer = typeof window === "undefined"

export async function getProducts(): Promise<Product[]> {
	if (isServer) return server.getAllProducts()
	const res = await fetch("/api/products")
	return res.json()
}

export async function getAllProducts(): Promise<Product[]> {
	return getProducts()
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
	if (isServer) return server.getProductsByCategory(category)
	const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`)
	return res.json()
}

export async function getProductById(id: number): Promise<Product | null> {
	if (isServer) return server.getProductById(id)
	const res = await fetch(`/api/products/${id}`)
	if (!res.ok) return null
	return res.json()
}

export async function searchProducts(query: string): Promise<Product[]> {
	if (isServer) return server.searchProducts(query)
	const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
	return res.json()
}

export async function addProduct(product: ProductCreate & { imageBase64?: string; imageName?: string; imageContentType?: string }): Promise<Product> {
	if (isServer) return server.addProduct(product as any)
	const res = await fetch(`/api/products`, { method: "POST", body: JSON.stringify(product), headers: { "Content-Type": "application/json" } })
	return res.json()
}

export async function updateProduct(id: number, updates: ProductUpdate | Partial<ProductCreate>): Promise<Product | null> {
	if (isServer) return server.updateProduct(id, updates)
	const res = await fetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(updates), headers: { "Content-Type": "application/json" } })
	if (!res.ok) return null
	return res.json()
}

export async function deleteProduct(id: number): Promise<boolean> {
	if (isServer) return server.deleteProduct(id)
	const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
	return res.ok
}

