"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

export default function AdminProductList({
  products,
  loading,
  onProductDeleted,
  onProductUpdated,
}: {
  products: Product[]
  loading: boolean
  onProductDeleted: () => void
  onProductUpdated: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<string>("")

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onProductDeleted()
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const handleEditPrice = (id: string, currentPrice: number) => {
    setEditingId(id)
    setEditPrice(currentPrice.toString())
  }

  const handleSavePrice = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number.parseFloat(editPrice) }),
      })

      if (response.ok) {
        setEditingId(null)
        onProductUpdated()
      }
    } catch (error) {
      console.error("Failed to update price:", error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Products List</h2>

      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products yet.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-start p-4 border border-border rounded-md hover:bg-neutral-light transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted">{product.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {editingId === product.id ? (
                    <>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 border border-border rounded text-foreground bg-white"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleSavePrice(product.id)}
                        className="px-2 py-1 bg-black text-white rounded text-sm hover:bg-slate-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 border border-black text-black rounded text-sm hover:bg-black hover:text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-primary">₹{product.price}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditPrice(product.id, product.price)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit price"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}