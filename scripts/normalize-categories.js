const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const CATEGORY_MAP = {
  'indoor-plants': 'indoor-plants',
  'plantes-interieur': 'indoor-plants',
  'indoor plants': 'indoor-plants',
  'outdoor-plants': 'outdoor-plants',
  'plantes-exterieur': 'outdoor-plants',
  'outdoor plants': 'outdoor-plants',
  'accessories': 'accessories',
  'accessoires': 'accessories',
  'care-products': 'care-products',
  'produits-entretien': 'care-products',
  'plant care': 'care-products',
}

function normalize(input) {
  if (!input) return null
  if (CATEGORY_MAP[input]) return CATEGORY_MAP[input]
  const key = input.toString().toLowerCase()
  return CATEGORY_MAP[key] || null
}

async function main() {
  console.log('Scanning products for non-canonical categories...')
  const products = await prisma.product.findMany({ select: { id: true, category: true } })
  const updates = []

  for (const p of products) {
    const normalized = normalize(p.category)
    if (normalized && normalized !== p.category) {
      updates.push({ id: p.id, from: p.category || null, to: normalized })
    }
  }

  if (updates.length === 0) {
    console.log('No products require category normalization.')
    return
  }

  console.log(`Found ${updates.length} products to update. Applying changes...`)

  for (const u of updates) {
    await prisma.product.update({ where: { id: u.id }, data: { category: u.to } })
    console.log(`Updated product ${u.id}: ${u.from} -> ${u.to}`)
  }

  console.log('Normalization complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
