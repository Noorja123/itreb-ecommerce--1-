"use client"

import type React from "react"

import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleOrderClick = () => {
    setShowOrderForm(true)
    setQuantity(1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const totalPrice = product.price * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/orders/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          quantity: quantity,
          price: product.price,
          totalPrice: totalPrice,
        }),
      })

      if (response.ok) {
        setMessage("Order submitted successfully!")
        setFormData({ fullName: "", phoneNumber: "", address: "" })
        setQuantity(1)
        setTimeout(() => setShowOrderForm(false), 2000)
      } else {
        setMessage("Failed to submit order. Please try again.")
      }
    } catch (error) {
      setMessage("Error submitting order. Please try again.")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-card-hover bg-white rounded-lg shadow-md overflow-hidden border border-border hover:shadow-xl">
      <div className="relative w-full h-48 bg-neutral-light overflow-hidden group">
        <img
          src={product.image_url || "/placeholder.svg?height=200&width=300&query=product"}
          alt={product.name}
          className="product-image-hover w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
        <p className="text-muted text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <button onClick={handleOrderClick} className="btn-secondary text-sm hover:shadow-lg transition-shadow">
            Order Now
          </button>
        </div>

        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image Section */}
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={product.image_url || "/placeholder.svg?height=300&width=300&query=product"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                  <h3 className="text-xl font-bold text-foreground mt-4 text-center">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">₹{product.price}</p>
                </div>

                {/* Order Form Section */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Order Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                        placeholder="Your delivery address"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Quantity</label>
                      <div className="flex items-center gap-3 border border-border rounded-md p-2 bg-white">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(-1)}
                          className="px-3 py-1 bg-black text-white rounded hover:bg-slate-800 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-lg font-semibold text-foreground flex-1 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(1)}
                          className="px-3 py-1 bg-black text-white rounded hover:bg-slate-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-md border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Total Price:</span>
                        <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
                      </div>
                    </div>

                    {message && (
                      <div
                        className={`p-3 rounded-md text-sm ${
                          message.includes("successfully") ? "bg-cyan-100 text-cyan-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {message}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1 px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Submitting..." : "Submit Order"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
