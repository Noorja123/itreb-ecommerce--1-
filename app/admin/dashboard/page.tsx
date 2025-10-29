"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AdminProductForm from "@/components/admin-product-form"
import AdminProductList from "@/components/admin-product-list"
import AdminOrdersList from "@/components/admin-orders-list"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-light py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>

          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "products" ? "text-primary border-b-2 border-primary" : "text-black hover:text-foreground"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "orders" ? "text-primary border-b-2 border-primary" : "text-black hover:text-foreground"
              }`}
            >
              Orders
            </button>
          </div>

          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <AdminProductForm onProductAdded={fetchProducts} />
              </div>
              <div className="lg:col-span-2">
                <AdminProductList
                  products={products}
                  loading={loading}
                  onProductDeleted={fetchProducts}
                  onProductUpdated={fetchProducts}
                />
              </div>
            </div>
          )}

          {activeTab === "orders" && <AdminOrdersList />}
        </div>
      </div>
      <Footer />
    </main>
  )
}
