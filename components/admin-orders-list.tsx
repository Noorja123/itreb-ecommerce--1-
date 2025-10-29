"use client"

import { useEffect, useState } from "react"

interface Order {
  timestamp: string
  productName: string
  fullName: string
  phoneNumber: string
  address: string
  quantity?: number
  price?: number
  totalPrice?: number
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    if (orders.length === 0) {
      alert("No orders to export")
      return
    }

    // Create CSV content
    const headers = [
      "Timestamp",
      "Product Name",
      "Customer Name",
      "Phone Number",
      "Address",
      "Quantity",
      "Unit Price",
      "Total Price",
    ]
    const csvContent = [
      headers.join(","),
      ...orders.map((order) =>
        [
          `"${order.timestamp}"`,
          `"${order.productName}"`,
          `"${order.fullName}"`,
          `"${order.phoneNumber}"`,
          `"${order.address}"`,
          order.quantity || 1,
          order.price || 0,
          order.totalPrice || order.price || 0,
        ].join(","),
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `orders-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <div className="flex gap-3">
          <button onClick={fetchOrders} className="btn-outline text-sm">
            Refresh
          </button>
          <button onClick={exportToExcel} className="btn-primary text-sm">
            Export to Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-foreground">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit Price</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-border hover:bg-slate-50">
                  <td className="py-3 px-4 text-foreground">{order.timestamp}</td>
                  <td className="py-3 px-4 text-foreground">{order.productName}</td>
                  <td className="py-3 px-4 text-foreground">{order.fullName}</td>
                  <td className="py-3 px-4 text-foreground">{order.phoneNumber}</td>
                  <td className="py-3 px-4 text-foreground">{order.address}</td>
                  <td className="py-3 px-4 text-foreground">{order.quantity || 1}</td>
                  <td className="py-3 px-4 text-foreground">₹{order.price || 0}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">₹{order.totalPrice || order.price || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
