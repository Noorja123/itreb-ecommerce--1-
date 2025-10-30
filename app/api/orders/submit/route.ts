import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productName,
      fullName,
      phoneNumber,
      address,
      // localBoard and regionalBoard are intentionally ignored for this test
      quantity = 1,
      totalPrice,
      productId,
    } = body;

    console.log("[v0] DIAGNOSTIC: Received data:", body);

    if (
      !productName ||
      !fullName ||
      !phoneNumber ||
      !address ||
      !productId
    ) {
      console.error("[v0] DIAGNOSTIC: Validation failed.");
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // --- TEMPORARY DIAGNOSTIC INSERT ---
    // We are NOT inserting local_board or regional_board to test the connection.
    const { data, error } = await adminClient.from("orders").insert([
      {
        product_id: productId,
        product_name: productName,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        // local_board: localBoard, // Temporarily removed
        // regional_board: regionalBoard, // Temporarily removed
        quantity: quantity,
        total_price: totalPrice,
      },
    ]).select();

    if (error) {
      console.error("[v0] DIAGNOSTIC: Supabase Insert Error:", error);
      return Response.json({ error: "Database insert failed.", details: error.message }, { status: 500 });
    }

    console.log("[v0] DIAGNOSTIC: Insert was successful!", data);
    return Response.json({ success: true, message: "Diagnostic test successful." });

  } catch (error: any) {
    console.error("[v0] DIAGNOSTIC: General Error:", error);
    return Response.json({ error: "A server error occurred.", details: error.message || 'Unknown error' }, { status: 500 });
  }
}