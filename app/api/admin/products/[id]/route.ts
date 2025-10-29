import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("products").update({ is_deleted: true }).eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ message: "Product not found" }, { status: 404 })
    }

    return Response.json({ message: "Product deleted" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json({ message: "Failed to delete product" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { price } = body

    if (price === undefined || price === null) {
      return Response.json({ message: "Price is required" }, { status: 400 })
    }

    const { getAdminClient } = await import("@/lib/supabase/admin")
    const adminClient = getAdminClient()

    const { data, error } = await adminClient
      .from("products")
      .update({ price: Number.parseFloat(price) })
      .eq("id", params.id)
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ message: "Failed to update product" }, { status: 500 })
    }

    return Response.json(data?.[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return Response.json({ message: "Failed to update product" }, { status: 500 })
  }
}
