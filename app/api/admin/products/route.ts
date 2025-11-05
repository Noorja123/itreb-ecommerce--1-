import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const description = formData.get("description") as string
    const stock_quantity = formData.get("stock_quantity") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File | null

    // --- 1. SERVER-SIDE VALIDATION ---
    // This checks if any of the required fields are empty.
    if (!name || !price || !description || !stock_quantity || !category) {
      return Response.json({ message: "Missing required fields. Please fill out the entire form." }, { status: 400 })
    }

    // --- 2. VALIDATE NUMBERS ---
    const parsedPrice = Number.parseFloat(price)
    const parsedStock = Number.parseInt(stock_quantity)

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return Response.json({ message: "Price and Quantity must be valid numbers." }, { status: 400 })
    }
    // --- END OF VALIDATION BLOCK ---

    let imageUrl = ""

    if (file) {
      const adminClient = getAdminClient()
      const fileName = `${Date.now()}-${file.name}`
      const fileBuffer = await file.arrayBuffer()

      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from("product-images")
        .upload(fileName, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        console.error("[v0] Upload error:", uploadError)
        return Response.json({ message: `Failed to upload image: ${uploadError.message}` }, { status: 500 })
      }

      const { data: publicUrlData } = adminClient.storage.from("product-images").getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }

    const adminClient = getAdminClient()
    const { data, error } = await adminClient
      .from("products")
      .insert([
        {
          name,
          price: parsedPrice, // Use validated number
          description,
          image_url: imageUrl || null,
          stock_quantity: parsedStock, // Use validated number
          in_stock: parsedStock > 0,   
          category: category,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error.message)
      return Response.json({ message: `Database error: ${error.message}` }, { status: 500 })
    }

    return Response.json(data?.[0], { status: 201 })
  } catch (error: any) {
    console.error("Error adding product:", error)
    return Response.json({ message: `Server error: ${error.message || 'Unknown error'}` }, { status: 500 })
  }
}