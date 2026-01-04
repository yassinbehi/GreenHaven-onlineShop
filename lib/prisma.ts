import type { PrismaClient as PrismaClientType } from "@prisma/client"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

let prisma: PrismaClientType

if (typeof window === "undefined") {
  // server-only: lazily require adapter and pool so they aren't bundled into client-side code
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg")
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { Pool } = require("pg")

  const connectionString = process.env.DATABASE_URL || ""
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
} else {
  // client-side placeholder to avoid bundler including server libs
  prisma = ({} as PrismaClientType)
}

export { prisma }
