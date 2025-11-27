// app/api/products/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // or SUPABASE_ANON_KEY if you prefer anon

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Do NOT log secrets; only log existence for debugging
  console.error("Missing Supabase server env vars (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
}

function makeSupabaseClient() {
  return createClient(SUPABASE_URL ?? "", SUPABASE_SERVICE_ROLE_KEY ?? "", {
    // ensure the client doesn't try to use browser features
    global: {
      fetch: globalThis.fetch as any,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = makeSupabaseClient();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search"); // example if you support search
    const limit = Number(searchParams.get("limit") ?? 0);

    // Build base query
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // optional filters (example)
    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    if (limit > 0) query = query.limit(limit);

    // execute
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error (server):", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in /api/products:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
