import { createClient } from "@/lib/supabase/server"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the 'category' from the request URL
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Start building the query
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    // If a category is provided, add the filter
    if (category) {
      query = query.eq('category', category)
    }

    // Execute the final query
    const { data, error } = await query

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