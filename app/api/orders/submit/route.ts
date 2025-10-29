export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productName, fullName, phoneNumber, address, quantity = 1, price } = body

    if (!productName || !fullName || !phoneNumber || !address) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { getAdminClient } = await import("@/lib/supabase/admin")
    const adminClient = getAdminClient()

    const { error } = await adminClient.from("orders").insert([
      {
        product_name: productName,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        quantity: quantity,
        price: price,
      },
    ])

    if (error) {
      console.error("[v0] Supabase error:", error)
      return Response.json({ error: "Failed to submit order" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to submit order:", error)
    return Response.json({ error: "Failed to submit order" }, { status: 500 })
  }
}
