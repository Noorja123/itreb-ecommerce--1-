"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string;
  order_status: string;
  timestamp: string
  productName: string
  productCode?: string; // <-- 1. Add productCode to interface
  fullName: string
  phoneNumber: string
  address: string
  localBoard?: string
  regionalBoard?: string
  subLocalBoard?: string;
  quantity?: number
  price?: number
  totalPrice?: number
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
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

  const handleStatusChange = async (orderId: string, newStatus: boolean) => {
    const newDbStatus = newStatus ? "processed" : "pending";
    const oldDbStatus = newStatus ? "pending" : "processed";

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, order_status: newDbStatus } : order
      )
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newDbStatus }),
      });

      if (!response.ok) {
        let errorData = { message: "Failed to update status" };
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore
        }
        throw new Error(errorData.message);
      }

      toast({
        title: "Order Updated",
        description: `Order status set to ${newDbStatus}.`,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: oldDbStatus } : order
        )
      );
      toast({
        title: "Error",
        description: err.message || "Could not update order status.",
        variant: "destructive",
      });
    }
  };


  const exportToExcel = () => {
    if (orders.length === 0) {
      alert("No orders to export")
      return
    }

    const headers = [
      "Timestamp",
      "Order Status",
      "Product Name",
      "Product Code", // <-- 2. Add to Excel export headers
      "Customer Name",
      "Phone Number",
      "Local Board",
      "Regional Board",
      "Sub Local Board",
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
          `"${order.order_status}"`,
          `"${order.productName}"`,
          `"${order.productCode || ''}"`, // <-- 3. Add to Excel export data
          `"${order.fullName}"`,
          `"${order.phoneNumber}"`,
          `"${order.localBoard || ''}"`,
          `"${order.regionalBoard || ''}"`,
          `"${order.subLocalBoard || ''}"`,
          `"${order.address.replace(/"/g, '""')}"`,
          order.quantity || 0,
          order.price || 0,
          order.totalPrice || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" })
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
          <button onClick={fetchOrders} className="btn-outline text-sm" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
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
            {/* FIX: Removed whitespace here */}
            <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Processed</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Product Code</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Local Board</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Regional Board</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Jamatkhana</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit Price</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total Price</th>
            </tr></thead>
            {/* FIX: Removed whitespace here */}
            <tbody>{orders.map((order, index) => (
                <tr key={index} className="border-b border-border hover:bg-slate-50">
                  <td className="py-3 px-4 text-foreground">
                    <Switch
                      id={`status-${order.id}`}
                      checked={order.order_status === 'processed'}
                      onCheckedChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                      aria-label={`Mark order from ${order.fullName} as processed`}
                    />
                  </td>
                  <td className="py-3 px-4 text-foreground">{order.timestamp}</td>
                  <td className="py-3 px-4 text-foreground">{order.productName}</td>
                  <td className="py-3 px-4 text-foreground">{order.productCode || "N/A"}</td>
                  <td className="py-3 px-4 text-foreground">{order.fullName}</td>
                  <td className="py-3 px-4 text-foreground">{order.phoneNumber}</td>
                  <td className="py-3 px-4 text-foreground">{order.localBoard}</td>
                  <td className="py-3 px-4 text-foreground">{order.regionalBoard}</td>
                  <td className="py-3 px-4 text-foreground">{order.subLocalBoard}</td>
                  <td className="py-3 px-4 text-foreground">{order.address}</td>
                  <td className="py-3 px-4 text-foreground">{order.quantity || "N/A"}</td>
                  <td className="py-3 px-4 text-foreground">₹{order.price?.toFixed(2) || "0.00"}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">₹{order.totalPrice?.toFixed(2) || "0.00"}</td>
                </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}