import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (Number.isNaN(id)) {
    return new Response(null, { status: 400 })
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return new Response(null, { status: 404 })

  if (product.imageData) {
    const bytes = product.imageData as unknown as BufferSource
    const headers = new Headers()
    headers.set("Content-Type", product.imageContentType || "application/octet-stream")
    return new Response(bytes, { status: 200, headers })
  }

  return new Response(null, { status: 404 })
}