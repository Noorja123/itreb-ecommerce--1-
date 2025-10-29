import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const adminClient = getAdminClient()
    const { data: orders, error } = await adminClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return Response.json([])
    }

    return Response.json(
      (orders || []).map((order: any) => ({
        timestamp: new Date(order.created_at).toLocaleString(),
        productName: order.product_name,
        fullName: order.customer_name,
        phoneNumber: order.customer_phone,
        address: order.customer_address,
        quantity: order.quantity,
        price: order.total_price && order.quantity ? order.total_price / order.quantity : 0,
        totalPrice: order.total_price,
      })),
    )
  } catch (error) {
    console.error("[v0] Failed to fetch orders:", error)
    return Response.json([])
  }
}