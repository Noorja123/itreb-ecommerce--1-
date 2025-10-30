import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productName,
      fullName,
      phoneNumber,
      address,
      localBoard,      // Added this
      regionalBoard,   // Added this
      quantity = 1,
      totalPrice,
      productId,
    } = body;

    // Log the received data for debugging
    console.log("[v0] INFO: Received order submission:", body);

    if (
      !productName ||
      !fullName ||
      !phoneNumber ||
      !address ||
      !productId
    ) {
      console.error("[v0] ERROR: Validation failed. Missing required fields.");
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // Insert the complete order data into the 'orders' table
    const { data, error } = await adminClient.from("orders").insert([
      {
        product_id: productId,
        product_name: productName,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        regional_board: regionalBoard,
        local_board: localBoard,          
        quantity: quantity,
        total_price: totalPrice,
      },
    ]).select();

    if (error) {
      console.error("[v0] ERROR: Supabase insert failed:", error);
      return Response.json({ error: "Database insert failed.", details: error.message }, { status: 500 });
    }

    console.log("[v0] SUCCESS: Order inserted successfully!", data);
    return Response.json({ success: true, message: "Order submitted successfully." });

  } catch (error: any) {
    console.error("[v0] ERROR: A general server error occurred:", error);
    return Response.json({ error: "A server error occurred.", details: error.message || 'Unknown error' }, { status: 500 });
  }
}