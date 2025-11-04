"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch" // <-- 1. Import Switch
import { useToast } from "@/hooks/use-toast" // <-- 2. Import useToast

interface Order {
  id: string; // <-- 3. Add id
  order_status: string; // <-- 4. Add order_status
  timestamp: string
  productName: string
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
  const { toast } = useToast() // <-- 5. Initialize toast

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

  // 6. Add handler for status change
  const handleStatusChange = async (orderId: string, newStatus: boolean) => {
    const newDbStatus = newStatus ? "processed" : "pending";
    const oldDbStatus = newStatus ? "pending" : "processed";

    // Optimistically update UI
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

      // --- NEW: Try to parse the error message ---
      if (!response.ok) {
        let errorData = { message: "Failed to update status" };
        try {
          // Try to get the specific JSON error from our API
          errorData = await response.json();
        } catch (e) {
          // Ignore if the response wasn't JSON
        }
        // Throw an error with the specific message
        throw new Error(errorData.message);
      }

      toast({
        title: "Order Updated",
        description: `Order status set to ${newDbStatus}.`,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
      // Revert UI on failure
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: oldDbStatus } : order
        )
      );
      toast({
        title: "Error",
        // --- NEW: Show the specific error message ---
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

    // Create CSV content
    const headers = [
      "Timestamp",
      "Order Status", // <-- 7. Add Status to export
      "Product Name",
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
          `"${order.order_status}"`, // <-- 8. Add Status value to export
          `"${order.productName}"`,
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

    // Create blob and download
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
            <thead>
              <tr className="border-b border-border">
                {/* 9. Add new table header */}
                <th className="text-left py-3 px-4 font-semibold text-foreground">Processed</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Local Board</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Regional Board</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Jamatkhana</th> 
                <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit Price</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-border hover:bg-slate-50">
                  {/* 10. Add new table cell with Switch */}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}