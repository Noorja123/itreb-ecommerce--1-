import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File | null

    let imageUrl = ""

    if (file) {
      const adminClient = getAdminClient()
      const fileName = `${Date.now()}-${file.name}`
      const fileBuffer = await file.arrayBuffer()

      console.log("[v0] Uploading file to storage:", fileName)

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

      console.log("[v0] Upload successful:", uploadData)

      const { data: publicUrlData } = adminClient.storage.from("product-images").getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
      console.log("[v0] Public URL:", imageUrl)
    }

    const adminClient = getAdminClient()
    const { data, error } = await adminClient
      .from("products")
      .insert([
        {
          name,
          price: Number.parseFloat(price),
          description,
          image_url: imageUrl || null,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ message: "Failed to add product" }, { status: 500 })
    }

    return Response.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error("Error adding product:", error)
    return Response.json({ message: "Failed to add product" }, { status: 500 })
  }
}
