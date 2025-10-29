import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return Response.json([], { status: 200 })
    }

    return Response.json(data || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return Response.json([], { status: 200 })
  }
}
