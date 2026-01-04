-- Add imageName, imageContentType and imageData to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageName" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageContentType" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageData" BYTEA;