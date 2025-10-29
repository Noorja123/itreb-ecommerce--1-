import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productName,
      fullName,
      phoneNumber,
      address,
      quantity = 1,
      totalPrice,
      productId,
    } = body;

    if (
      !productName ||
      !fullName ||
      !phoneNumber ||
      !address ||
      !productId
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    const { error } = await adminClient.from("orders").insert([
      {
        product_id: productId,
        product_name: productName,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        quantity: quantity,
        total_price: totalPrice,
      },
    ]);

    if (error) {
      console.error("[v0] Supabase error:", error);
      return Response.json({ error: "Failed to submit order" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[v0] Failed to submit order:", error);
    return Response.json({ error: "Failed to submit order" }, { status: 500 });
  }
}