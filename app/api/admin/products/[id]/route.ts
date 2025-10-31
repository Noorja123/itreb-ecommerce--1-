// File: app/api/admin/products/[id]/route.ts

import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";

// Helper function to extract ID from the URL
function getProductIdFromUrl(url: string): string | undefined {
    try {
        const parts = url.split('/');
        // The ID will be the last part of the URL path
        return parts[parts.length - 1];
    } catch (error) {
        console.error("Could not parse product ID from URL:", url, error);
        return undefined;
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Use the URL from the request object as a reliable source for the ID
  const productId = getProductIdFromUrl(request.url);
  console.log(`DELETE request received for product ID: ${productId}`);

  if (!productId) {
    return Response.json({ message: "Product ID could not be determined from the URL." }, { status: 400 });
  }

  try {
    const adminClient = getAdminClient();
    const { error } = await adminClient
      .from("products")
      .update({ is_deleted: true })
      .eq("id", productId);

    if (error) {
      console.error("Supabase error (DELETE):", error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error during product deletion:", error);
    return Response.json({ message: "Failed to delete product due to a server error." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Use the URL from the request object as a reliable source for the ID
  const productId = getProductIdFromUrl(request.url);
  console.log(`PATCH request received for product ID: ${productId}`);

  if (!productId) {
    return Response.json({ message: "Product ID could not be determined from the URL." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { price, stock_quantity } = body;

    if (price === undefined || stock_quantity === undefined) {
      return Response.json({ message: "Price and stock quantity are required." }, { status: 400 });
    }

    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from("products")
      .update({
        price: Number(price),
        stock_quantity: Number(stock_quantity),
        in_stock: Number(stock_quantity) > 0,
      })
      .eq("id", productId)
      .select();

    if (error) {
      console.error("Supabase error (PATCH):", error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(data?.[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ message: "Failed to update product due to a server error." }, { status: 500 });
  }
}