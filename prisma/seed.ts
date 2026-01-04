import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const defaultProducts = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    price: 145,
    category: "indoor-plants",
    stock: 15,
    image: "/monstera-deliciosa-modern-pot.png",
    description: "Perfect for beginners",
  },
  {
    id: 2,
    name: "Snake Plant",
    price: 105,
    category: "indoor-plants",
    stock: 8,
    image: "/snake-plant-ceramic-pot.png",
    description: "Low maintenance beauty",
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    price: 180,
    category: "indoor-plants",
    stock: 6,
    image: "/fiddle-leaf-fig-lush.png",
    description: "Statement plant for bright spaces",
  },
  {
    id: 4,
    name: "Peace Lily",
    price: 85,
    category: "indoor-plants",
    stock: 12,
    image: "/peace-lily.png",
    description: "Air-purifying flowering plant",
  },
  {
    id: 5,
    name: "Rubber Plant",
    price: 120,
    category: "indoor-plants",
    stock: 10,
    image: "/rubber-plant.png",
    description: "Glossy leaves, easy care",
  },
  {
    id: 6,
    name: "Bougainvillea",
    price: 95,
    category: "outdoor-plants",
    stock: 8,
    image: "/vibrant-bougainvillea.png",
    description: "Colorful flowering vine",
  },
  {
    id: 7,
    name: "Olive Tree",
    price: 250,
    category: "outdoor-plants",
    stock: 4,
    image: "/solitary-olive-tree.png",
    description: "Mediterranean classic",
  },
  {
    id: 8,
    name: "Lavender",
    price: 65,
    category: "outdoor-plants",
    stock: 15,
    image: "/lavender-plant.png",
    description: "Fragrant herb with purple flowers",
  },
  {
    id: 9,
    name: "Ceramic Planter Set",
    price: 95,
    category: "accessories",
    stock: 25,
    image: "/modern-ceramic-plant-pots.png",
    description: "Set of 3 modern planters",
  },
  {
    id: 10,
    name: "Plant Care Kit",
    price: 65,
    category: "accessories",
    stock: 12,
    image: "/plant-care-kit.png",
    description: "Essential care tools & fertilizer",
  },
  {
    id: 11,
    name: "Watering Can",
    price: 45,
    category: "accessories",
    stock: 20,
    image: "/metal-watering-can.png",
    description: "Stylish copper watering can",
  },
  {
    id: 12,
    name: "Plant Stand",
    price: 85,
    category: "accessories",
    stock: 8,
    image: "/elegant-plant-stand.png",
    description: "Wooden plant display stand",
  },
  {
    id: 13,
    name: "Organic Fertilizer",
    price: 35,
    category: "care-products",
    stock: 30,
    image: "/organic-fertilizer-mix.png",
    description: "Natural plant food",
  },
  {
    id: 14,
    name: "Pruning Shears",
    price: 55,
    category: "care-products",
    stock: 15,
    image: "/placeholder-12v9x.png",
    description: "Professional gardening scissors",
  },
  {
    id: 15,
    name: "Soil Mix",
    price: 25,
    category: "care-products",
    stock: 40,
    image: "/potting-soil.png",
    description: "Premium potting soil blend",
  },
]

async function main() {
  console.log("🌱 Seeding database with default products...")

  for (const product of defaultProducts) {
    try {
      const createdProduct = await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: product,
      })
      console.log(`✅ Seeded product: ${createdProduct.name}`)
    } catch (error) {
      console.error(`❌ Error seeding product ${product.id}:`, error)
    }
  }

  console.log("✨ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
