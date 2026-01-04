# Prisma Database Setup Guide

## ✅ Completed Setup

1. ✅ **Prisma & @prisma/client installed**
2. ✅ **Prisma initialized** - `prisma/schema.prisma` created
3. ✅ **Database schema defined** - Product model with all fields
4. ✅ **Environment variables configured** - `.env` created
5. ✅ **Prisma client singleton** - `lib/prisma.ts` set up
6. ✅ **Seed script created** - `prisma/seed.ts` with 15 default products
7. ✅ **Product actions refactored** - Now use Prisma instead of localStorage
8. ✅ **NPM scripts added** - For database operations

---

## 🚀 Next Steps: Configure Your Database

### Option 1: Local PostgreSQL (Recommended for Development)

**Prerequisites:** PostgreSQL server running locally or via Docker

1. **Update `.env`** with your local database connection:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/greenhaven_db"
   ```

2. **Create the database** (if not exists):
   ```bash
   createdb greenhaven_db
   ```

3. **Push the schema to your database**:
   ```bash
   npm run prisma:migrate
   ```

4. **Seed the database**:
   ```bash
   npm run prisma:seed
   ```

---

### Option 2: Prisma Cloud (Free Tier - No Local Setup)

1. **Visit:** https://console.prisma.io/
2. **Create a free PostgreSQL database**
3. **Copy the connection string** and update `.env`:
   ```
   DATABASE_URL="your_prisma_connection_string_here"
   ```

4. **Push the schema**:
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database**:
   ```bash
   npm run prisma:seed
   ```

---

### Option 3: PostgreSQL via Docker (Quick Setup)

```bash
# Start PostgreSQL in Docker
docker run --name postgres_greenhaven \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=greenhaven_db \
  -p 5432:5432 \
  -d postgres:latest

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/greenhaven_db"

# Push schema & seed
npm run prisma:migrate
npm run prisma:seed
```

---

## 📋 Available Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create/apply migrations (pushes schema to DB)
npm run prisma:migrate

# Seed the database with default products
npm run prisma:seed

# Open Prisma Studio (GUI for database)
npx prisma studio
```

---

## 🔧 Key Files Created/Modified

- **`prisma/schema.prisma`** - Database schema (Product model)
- **`prisma/seed.ts`** - Seed script with 15 default products
- **`lib/prisma.ts`** - Prisma Client singleton instance
- **`actions/products.ts`** - Refactored to use Prisma (async functions)
- **`.env`** - Database connection string
- **`package.json`** - Added Prisma scripts & `tsx` dependency

---

## ⚠️ Important Notes

1. **`.env` is in `.gitignore`** - Never commit your DATABASE_URL!
2. **All product functions are now async** - Components using them need to be updated to `await` results
3. **Server vs Client Components**:
   - Use Prisma in **Server Components** or **Server Actions**
   - Client components should call **Server Actions** to fetch data

---

## 🐛 Troubleshooting

**Error: "Can't reach database server"**
- Verify your DATABASE_URL is correct
- Check PostgreSQL is running locally or cloud connection is active

**Error: "Column does not exist"**
- Run `npm run prisma:migrate` to sync schema with database

**Error: "No records inserted"**
- Run `npm run prisma:seed` to populate default products

---

## 📝 Example: Using in Server Components

```typescript
// app/products/page.tsx
import { getAllProducts } from "@/lib/services/products"

export default async function ProductsPage() {
  const products = await getAllProducts()
  
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

---

## 🔐 Example: Using in Server Actions

```typescript
// app/admin/actions.ts
"use server"

import { addProduct, type Product } from "@/lib/services/products"

export async function createNewProduct(product: Omit<Product, "id">) {
  const newProduct = await addProduct(product)
  return newProduct
}
```

---

**Setup complete! Configure your database above and run `npm run prisma:seed` when ready.** 🌱
