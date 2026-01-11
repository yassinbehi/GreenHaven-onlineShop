"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Product, ProductCreate, ProductUpdate } from "@/lib/products"
import { getCategorySlug } from "@/lib/utils"

interface ProductFormProps {
  product?: Product
  onSave: (product: ProductCreate | ProductUpdate) => Promise<void> | void
  onCancel: () => void
}

import { getCategorySlug } from "@/lib/utils"

const categories = [
  { value: "indoor-plants", label: "Plantes d'Intérieur" },
  { value: "outdoor-plants", label: "Plantes d'Extérieur" },
  { value: "accessories", label: "Accessoires" },
  { value: "care-products", label: "Produits d'Entretien" },
]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    // image (legacy URL), imageBase64 (uploaded file), imageName, imageContentType for upload
    image: "",
    imageBase64: "",
    imageName: "",
    imageContentType: "",
    imagePreview: "",
    description: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: getCategorySlug(product.category) || product.category || "",
        stock: product.stock.toString(),
        image: product.image,
        imagePreview: product.image || "",
        description: product.description || "",
      })
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // result is like: data:<mime>;base64,<data>
        const [, base64] = result.split(",")
        resolve(base64)
      }
      reader.onerror = (err) => reject(err)
    })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit files to ~2MB to avoid request failures with base64 payloads
    const maxBytes = 2 * 1024 * 1024 // 2MB
    if (file.size > maxBytes) {
      alert("Fichier trop volumineux. Choisissez une image de moins de 2MB.")
      return
    }

    const base64 = await fileToBase64(file)
    setFormData({
      ...formData,
      imageBase64: base64,
      imageName: file.name,
      imageContentType: file.type,
      imagePreview: URL.createObjectURL(file),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData: any = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      description: formData.description,
    }

    // If a new file was chosen, include base64 payload for server to persist
    if (formData.imageBase64) {
      productData.imageBase64 = formData.imageBase64
      productData.imageName = formData.imageName
      productData.imageContentType = formData.imageContentType
    } else if (formData.image) {
      // keep legacy image URL if present and no new file uploaded
      productData.image = formData.image
    }

    if (product) {
      await onSave({ ...productData, id: product.id })
    } else {
      await onSave(productData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{product ? "Modifier le produit" : "Ajouter un produit"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Quantité en stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (parcourir le fichier)</Label>
              <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Aperçu" className="mt-2 h-24 w-24 object-cover rounded" />
              ) : (
                formData.image && (
                  <img src={formData.image} alt="Aperçu" className="mt-2 h-24 w-24 object-cover rounded" />
                )
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description du produit..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {product ? "Mettre à jour le produit" : "Ajouter le produit"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
