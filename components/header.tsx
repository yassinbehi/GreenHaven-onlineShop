"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Leaf, Menu, X } from "lucide-react"
import { CartSidebar } from "./cart-sidebar"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">GreenHaven</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="/boutique" className="text-foreground hover:text-primary transition-colors">
              Boutique
            </Link>
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors">Catégories</button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/categories/plantes-interieur" className="block px-4 py-2 text-sm hover:bg-muted">
                    Plantes d'Intérieur
                  </Link>
                  <Link href="/categories/plantes-exterieur" className="block px-4 py-2 text-sm hover:bg-muted">
                    Plantes d'Extérieur
                  </Link>
                  <Link href="/categories/accessoires" className="block px-4 py-2 text-sm hover:bg-muted">
                    Accessoires
                  </Link>
                  <Link href="/categories/produits-entretien" className="block px-4 py-2 text-sm hover:bg-muted">
                    Produits d'Entretien
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/a-propos" className="text-foreground hover:text-primary transition-colors">
              À Propos
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des plantes..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <CartSidebar />

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/boutique"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Boutique
              </Link>
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Catégories</span>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/categories/plantes-interieur"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    Plantes d'Intérieur
                  </Link>
                  <Link
                    href="/categories/plantes-exterieur"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    Plantes d'Extérieur
                  </Link>
                  <Link
                    href="/categories/accessoires"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    Accessoires
                  </Link>
                  <Link
                    href="/categories/produits-entretien"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    Produits d'Entretien
                  </Link>
                </div>
              </div>
              <Link
                href="/a-propos"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                À Propos
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>

              <form onSubmit={handleSearch} className="relative sm:hidden">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des plantes..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
