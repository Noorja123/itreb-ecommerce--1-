import { getAdminClient } from "@/lib/supabase/admin";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      address,
      localBoard,
      regionalBoard,
      subLocalBoard, // Add this
      items,
    } = body;

    console.log("[v0] INFO: Received order submission:", body);

    if (
      !fullName ||
      !phoneNumber ||
      !address ||
      !localBoard ||
      !regionalBoard ||
      !items ||
      items.length === 0
    ) {
      console.error("[v0] ERROR: Validation failed. Missing required fields.");
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    const ordersToInsert = items.map((item: CartItem) => ({
        product_id: item.id,
        product_name: item.name,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        local_board: localBoard,
        regional_board: regionalBoard,
        sub_local_board: subLocalBoard, // Add this
        quantity: item.quantity,
        total_price: item.price * item.quantity,
    }));

    const { data, error } = await adminClient.from("orders").insert(ordersToInsert).select();

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