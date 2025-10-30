"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface FormData {
  name: string
  price: string
  description: string
  stock_quantity: string
}

export default function AdminProductForm({
  onProductAdded,
}: {
  onProductAdded: () => void
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [bucketReady, setBucketReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initializeBucket = async () => {
      try {
        const response = await fetch("/api/setup/bucket", { method: "POST" })
        if (response.ok) {
          setBucketReady(true)
        }
      } catch (error) {
        console.error("[v0] Failed to initialize bucket:", error)
      }
    }

    initializeBucket()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("stock_quantity", formData.stock_quantity)
      if (file) {
        formDataToSend.append("file", file)
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setMessage("Product added successfully!")
        setFormData({ name: "", price: "", description: "", stock_quantity: "" })
        setFile(null)
        setPreview("")
        if (fileInputRef.current) fileInputRef.current.value = ""
        onProductAdded()
      } else {
        const errorData = await response.json()
        setMessage(`Failed to add product: ${errorData.message}`)
      }
    } catch (error) {
      setMessage("An error occurred")
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <h2 className="text-2xl font-bold text-primary mb-6">Add New Product</h2>

      {message && (
        <div
          className={`px-4 py-3 rounded-md mb-4 animate-in fade-in ${
            message.includes("successfully") ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Code</label>
          <input
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
          {preview && (
            <div className="mt-3 relative w-32 h-32 rounded-md overflow-hidden border border-border">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 transition-opacity">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  )
}