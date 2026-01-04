"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Leaf,
  Package,
  ShoppingCart,
  LogOut,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Truck,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import { removeAuthToken } from "@/lib/auth"
import { getOrders, type Order } from "@/lib/cart"
import { getProducts, addProduct, updateProduct, deleteProduct, type Product, type ProductCreate, type ProductUpdate } from "@/lib/products"
import { ProductForm } from "./product-form"
import Link from "next/link"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: "unread" | "read"
}

function getMessages(): Message[] {
  if (typeof window !== "undefined") {
    const messages = localStorage.getItem("messages")
    return messages ? JSON.parse(messages) : []
  }
  return []
}

function markMessageAsRead(messageId: string) {
  if (typeof window !== "undefined") {
    const messages = getMessages()
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, status: "read" as const } : msg))
    localStorage.setItem("messages", JSON.stringify(updatedMessages))
  }
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      const prods = await getProducts()
      if (mounted) setProducts(prods)
      try {
        const ord = await getOrders()
        if (mounted) setOrders(ord)
      } catch (e) {
        // keep empty
      }
      setMessages(getMessages())
    }
    fetchData()

    const handleStorageChange = async () => {
      try {
        const ord = await getOrders()
        setOrders(ord)
      } catch (e) {
        // ignore
      }
      const prods = await getProducts()
      setProducts(prods)
      setMessages(getMessages())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      mounted = false
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    window.location.reload()
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined)
    setShowProductForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleSaveProduct = async (productData: ProductCreate | ProductUpdate) => {
    if ("id" in productData) {
      await updateProduct(productData.id, productData)
    } else {
      await addProduct(productData)
    }

    const prods = await getProducts()
    setProducts(prods)
    setShowProductForm(false)
    setEditingProduct(undefined)
  }

  const handleDeleteProduct = async (id: number) => {
    if (deleteConfirm === id) {
      await deleteProduct(id)
      const prods = await getProducts()
      setProducts(prods)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (deleteOrderConfirm === orderId) {
      // Try delete on server
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      if (res.ok) {
        const updated = (await getOrders())
        setOrders(updated)
      } else {
        // fallback to local removal
        const updatedOrders = orders.filter((order) => order.id !== orderId)
        setOrders(updatedOrders)
      }
      setDeleteOrderConfirm(null)
    } else {
      setDeleteOrderConfirm(orderId)
      setTimeout(() => setDeleteOrderConfirm(null), 3000)
    }
  }

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId)
    setMessages(getMessages())
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)

  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const processingOrders = orders.filter((order) => order.status === "processing").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length
  const unreadMessages = messages.filter((msg) => msg.status === "unread").length

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Tableau de Bord GreenHaven</span>
              </Link>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  Voir la Boutique
                </Button>
              </Link>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires Total</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Non Lus</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribution des Commandes par Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                <div className="text-sm text-yellow-700">En Attente</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
                <div className="text-sm text-blue-700">En Traitement</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
                <div className="text-sm text-green-700">Terminées</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{cancelledOrders}</div>
                <div className="text-sm text-red-700">Annulées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="messages">
              Messages {unreadMessages > 0 && <Badge className="ml-2">{unreadMessages}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commandes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Aucune commande pour le moment</div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.customer.name} • {order.customer.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              📞 {order.customer.phone} • 📍 {order.customer.city}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status === "pending" && "En Attente"}
                              {order.status === "processing" && "En Traitement"}
                              {order.status === "completed" && "Terminée"}
                              {order.status === "cancelled" && "Annulée"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-3">
                          <h4 className="font-medium text-sm">Articles de la Commande:</h4>
                          {order.items.map((item, index) => {
                            const product = products.find((p) => p.id === item.id)
                            return (
                              <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                                <img
                                  src={product?.image || item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-sm">{(item.price * item.quantity).toFixed(2)} TND</p>
                                  <p className="text-xs text-muted-foreground">{item.price} TND chacun</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg mb-3">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Sous-total:</span>
                              <span>{order.subtotal.toFixed(2)} TND</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                <span>Frais de Transport:</span>
                              </div>
                              <span>{order.transportFee.toFixed(2)} TND</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-1">
                              <span>Total:</span>
                              <span>{order.total.toFixed(2)} TND</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Paiement:{" "}
                              {order.paymentMethod === "COD" ? "Paiement à la Livraison" : order.paymentMethod}
                            </p>
                            <p className="text-sm text-muted-foreground">Adresse: {order.customer.address}</p>
                          </div>
                          <div className="flex gap-2">
                            {order.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                                  Traiter
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                >
                                  Annuler
                                </Button>
                              </>
                            )}
                            {order.status === "processing" && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                                Terminer
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id)}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              {deleteOrderConfirm === order.id ? "Confirmer?" : "Supprimer"}
                            </Button>
                          </div>
                        </div>
                        {deleteOrderConfirm === order.id && (
                          <Alert className="mt-2">
                            <AlertDescription className="text-xs">
                              Cliquez sur Supprimer à nouveau pour confirmer, ou attendez 3 secondes pour annuler.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Produits</CardTitle>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Produit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="aspect-square overflow-hidden rounded-lg mb-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 capitalize">
                          {product.category === "indoor-plants" && "Plantes d'Intérieur"}
                          {product.category === "outdoor-plants" && "Plantes d'Extérieur"}
                          {product.category === "accessories" && "Accessoires"}
                          {product.category === "plant-care" && "Soins des Plantes"}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-primary">{product.price} TND</span>
                          <Badge variant={product.stock > 10 ? "default" : "secondary"}>Stock: {product.stock}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {deleteConfirm === product.id ? "Confirmer?" : "Supprimer"}
                          </Button>
                        </div>
                        {deleteConfirm === product.id && (
                          <Alert className="mt-2">
                            <AlertDescription className="text-xs">
                              Cliquez sur Supprimer à nouveau pour confirmer, ou attendez 3 secondes pour annuler.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Aucun message pour le moment</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-lg p-4 ${message.status === "unread" ? "bg-blue-50 border-blue-200" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{message.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              De: {message.name} ({message.email})
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={message.status === "unread" ? "default" : "secondary"}>
                              {message.status === "unread" ? "Non Lu" : "Lu"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">{message.date}</p>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded mb-3">
                          <p className="text-sm">{message.message}</p>
                        </div>
                        {message.status === "unread" && (
                          <Button size="sm" onClick={() => handleMarkAsRead(message.id)}>
                            Marquer comme Lu
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowProductForm(false)
            setEditingProduct(undefined)
          }}
        />
      )}
    </div>
  )
}
