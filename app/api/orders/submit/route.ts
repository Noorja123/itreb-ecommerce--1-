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
      subLocalBoard,
      items,
    } = body;

    if (
      !fullName ||
      !phoneNumber ||
      !address ||
      !localBoard ||
      !regionalBoard ||
      !items ||
      items.length === 0
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    for (const item of items) {
      const { data: product, error: productError } = await adminClient
        .from('products')
        .select('stock_quantity, name')
        .eq('id', item.id)
        .single();

      if (productError || !product) {
        return Response.json({ error: `Product with id ${item.id} not found.` }, { status: 404 });
      }

      if (product.stock_quantity < item.quantity) {
        return Response.json({ error: `Not enough stock for ${product.name}. Only ${product.stock_quantity} left.` }, { status: 400 });
      }
    }

    const ordersToInsert = items.map((item: CartItem) => ({
        product_id: item.id,
        product_name: item.name,
        customer_name: fullName,
        customer_phone: phoneNumber,
        customer_address: address,
        local_board: localBoard,
        regional_board: regionalBoard,
        sub_local_board: subLocalBoard,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
    }));

    const { data, error } = await adminClient.from("orders").insert(ordersToInsert).select();

    if (error) {
      return Response.json({ error: "Database insert failed.", details: error.message }, { status: 500 });
    }

    for (const item of items) {
        const { data: product } = await adminClient
        .from('products')
        .select('stock_quantity')
        .eq('id', item.id)
        .single();

        if (product) {
            const newStock = product.stock_quantity - item.quantity;
            await adminClient
            .from('products')
            .update({ stock_quantity: newStock, in_stock: newStock > 0 })
            .eq('id', item.id);
        }
    }


    return Response.json({ success: true, message: "Order submitted successfully." });

  } catch (error: any) {
    return Response.json({ error: "A server error occurred.", details: error.message || 'Unknown error' }, { status: 500 });
  }
}