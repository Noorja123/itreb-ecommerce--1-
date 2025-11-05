"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { CATEGORIES } from "@/lib/categories"
import { ArrowLeft } from "lucide-react" 


interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  is_deleted?: boolean
  stock_quantity: number; 
  in_stock?: boolean;     
  category?: string;      
}

const navCategories = ["All Products", ...CATEGORIES]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchProducts = async (category: string | null) => {
    if (category === null) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      let url = "/api/products"
      if (category && category !== "All Products") {
        url = `/api/products?category=${encodeURIComponent(category)}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      const activeProducts = data.filter((p: Product) => !p.is_deleted)
      setProducts(activeProducts)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [selectedCategory])

  
  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted mt-4">Loading products...</p>
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted text-lg">No products available in this category.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  const renderCategoryGrid = () => (
    <>
      <h1 className="text-4xl font-bold mb-2 text-primary">Our Products</h1>
      <p className="text-muted mb-8">Browse our collection by category</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="product-card-hover bg-white rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl flex flex-col items-center justify-center p-8 min-h-[150px] text-center"
          >
            <h2 className="text-2xl font-semibold text-foreground">{category}</h2>
          </button>
        ))}
      </div>
    </>
  )

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 bg-neutral-light py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 10. Conditional Rendering Logic */}
          {selectedCategory ? (
      
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="btn-outline text-sm mb-6 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Categories
              </button>
              <h1 className="text-3xl font-bold mb-8 text-primary">
                {selectedCategory}
              </h1>
              {renderProductGrid()}
            </div>
          ) : (
            // No category selected, show the category grid
            renderCategoryGrid()
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}