import { prisma } from "@/lib/prisma"
import type { Product as PrismaProduct } from "@prisma/client"

export type Product = PrismaProduct
export type ProductCreate = Omit<Product, "id" | "createdAt" | "updatedAt">
export type ProductUpdate = Partial<Omit<Product, "createdAt" | "updatedAt">> & { id: number }

// Product retrieval functions

export async function getAllProducts(): Promise<Product[]> {
  return await prisma.product.findMany()
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return await prisma.product.findMany({
    where: { category },
  })
}

export async function getProductById(id: number): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { id },
  })
}

export async function searchProducts(query: string): Promise<Product[]> {
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return await getAllProducts()

  const products: Product[] = await prisma.product.findMany()

  type SearchResult = { product: Product; score: number }
  const searchResults: SearchResult[] = products.map((product) => {
    let score = 0
    const name = product.name.toLowerCase()
    const description = product.description?.toLowerCase() || ""
    const category = product.category.toLowerCase().replace("-", " ")

    // Exact name match gets highest score
    if (name === searchTerm) score += 100
    // Name starts with search term
    else if (name.startsWith(searchTerm)) score += 80
    // Name contains search term
    else if (name.includes(searchTerm)) score += 60

    // Description matches
    if (description.includes(searchTerm)) score += 40

    // Category matches
    if (category.includes(searchTerm)) score += 30

    // Partial word matches in name
    const searchWords = searchTerm.split(" ")
    searchWords.forEach((word) => {
      if (word.length > 2) {
        if (name.includes(word)) score += 20
        if (description.includes(word)) score += 10
      }
    })

    return { product, score }
  })

  // Return products with score > 0, sorted by relevance
  return searchResults
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.product)
}

// Product management functions (mutations)

export async function addProduct(product: ProductCreate & { imageBase64?: string; imageName?: string; imageContentType?: string }): Promise<Product> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { imageBase64, imageName, imageContentType, ...rest } = product as unknown as any
  // Create product record first
  const created = await prisma.product.create({ data: rest })

  // If image provided as base64, store bytes in DB and set image endpoint
  if (imageBase64) {
    const buffer = Buffer.from(imageBase64, "base64")
    const updated = await prisma.product.update({
      where: { id: created.id },
      data: {
        imageData: buffer,
        imageName: imageName || null,
        imageContentType: imageContentType || null,
        image: `/api/products/${created.id}/image`,
      },
    })
    return updated
  }

  return created
}

export async function updateProduct(
  id: number,
  updates: ProductUpdate | Partial<ProductCreate> | (ProductUpdate & { imageBase64?: string; imageName?: string; imageContentType?: string }),
): Promise<Product | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { imageBase64, imageName, imageContentType, ...rest } = updates as unknown as any

    // If a new image was uploaded, store bytes in DB and set image endpoint
    if (imageBase64) {
      const buffer = Buffer.from(imageBase64, "base64")
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...rest,
          imageData: buffer,
          imageName: imageName || null,
          imageContentType: imageContentType || null,
          image: `/api/products/${id}/image`,
        },
      })
      return updated
    }

    return await prisma.product.update({
      where: { id },
      data: rest,
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Product not found
    return null
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id },
    })
    return true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Product not found
    return false
  }
}
