import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// Handle GET requests (Fetch products)
export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Number(searchParams.get("limit") ?? 0);

    // Build base query
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("name", `%${search}%`); // Changed 'title' to 'name' to match your schema
    if (limit > 0) query = query.limit(limit);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error (server):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected error in /api/admin/products:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle POST requests (Create new product)
export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const formData = await request.formData();

    // Extract fields from FormData
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const stock_quantity = parseInt(formData.get("stock_quantity") as string);
    const category = formData.get("category") as string;
    const file = formData.get("file") as File | null;

    if (!name || !price || !description || isNaN(stock_quantity)) {
      return NextResponse.json(
        { message: "Missing required fields (name, price, description, stock)" },
        { status: 400 }
      );
    }

    let image_url = null;

    // Handle Image Upload if file exists
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload image: " + uploadError.message },
          { status: 500 }
        );
      }

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    // Insert into Database
    const { data, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        price,
        description,
        stock_quantity,
        category,
        image_url,
        in_stock: stock_quantity > 0,
        is_deleted: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { message: "Failed to save product: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("POST Handler Error:", error);
    return NextResponse.json(
      { message: "Internal server error: " + (error.message || "Unknown") },
      { status: 500 }
    );
  }
}