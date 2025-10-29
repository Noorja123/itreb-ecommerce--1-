import { getAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getAdminClient()

    // Try to create the bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("[v0] Error listing buckets:", listError)
      return NextResponse.json({ error: "Failed to list buckets" }, { status: 500 })
    }

    const bucketExists = buckets?.some((b) => b.name === "product-images")

    if (!bucketExists) {
      const { data, error: createError } = await supabase.storage.createBucket("product-images", {
        public: true,
      })

      if (createError) {
        console.error("[v0] Error creating bucket:", createError)
        return NextResponse.json({ error: "Failed to create bucket", details: createError.message }, { status: 500 })
      }

      console.log("[v0] Bucket created successfully:", data)
    }

    return NextResponse.json({ success: true, message: "Bucket is ready" })
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
