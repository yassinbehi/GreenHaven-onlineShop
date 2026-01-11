import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Category helpers: map various inputs to canonical slugs and display labels
const CATEGORY_SLUG_MAP: Record<string, string> = {
  "indoor-plants": "indoor-plants",
  "plantes-interieur": "indoor-plants",
  "indoor plants": "indoor-plants",
  "outdoor-plants": "outdoor-plants",
  "plantes-exterieur": "outdoor-plants",
  "outdoor plants": "outdoor-plants",
  "accessories": "accessories",
  "accessoires": "accessories",
  "care-products": "care-products",
  "produits-entretien": "care-products",
  "plant care": "care-products",
}

const CATEGORY_LABELS: Record<string, string> = {
  "indoor-plants": "Plantes d'Intérieur",
  "outdoor-plants": "Plantes d'Extérieur",
  "accessories": "Accessoires",
  "care-products": "Produits d'Entretien",
}

export function getCategorySlug(input?: string): string {
  if (!input) return ""
  if (CATEGORY_SLUG_MAP[input]) return CATEGORY_SLUG_MAP[input]
  const key = input.toString().toLowerCase()
  return CATEGORY_SLUG_MAP[key] ?? ""
}

export function getCategoryLabel(input?: string): string {
  const slug = getCategorySlug(input) || input || ""
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug]
  // Fallback: prettify slug-like strings
  return slug.toString().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
