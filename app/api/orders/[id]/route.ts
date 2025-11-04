import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// This is the proven helper function from your products API route
function getOrderIdFromUrl(url: string): string | undefined {
    try {
        // Handle potential query parameters by splitting at '?' first
        const pathname = url.split('?')[0];
        const parts = pathname.split('/');
        // The ID will be the last part of the URL path
        return parts[parts.length - 1];
    } catch (error) {
        console.error("Could not parse order ID from URL:", url, error);
        return undefined;
    }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } } // We keep this for type safety, but won't use it
) {
  
  // --- THIS IS THE FIX ---
  // We use the helper function on the raw request URL, just like your products route
  const id = getOrderIdFromUrl(request.url);
  // --- END OF FIX ---

  if (!id) {
    console.error("[PATCH Order] Error: ID was null after parsing URL:", request.url);
    return NextResponse.json(
      // I've changed the error message, so if this fails, we'll see a *new* error.
      { message: "Server failed to parse Order ID from request URL." }, 
      { status: 400 }
    );
  }

  let status;
  try {
    const body = await request.json();
    status = body.status;
  } catch (e) {
    console.error("[PATCH Order] Error: Invalid JSON body.", e);
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }


  if (!status) {
    return NextResponse.json(
      { message: "Status is required in the request body." },
      { status: 400 }
    );
  }

  console.log(`[PATCH Order] Attempting to update ID: ${id} to Status: ${status}`);

  try {
    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id) // This will now use the correctly parsed ID
      .select()
      .single();

    if (error) {
      console.error(`[PATCH Order] Supabase error for ID ${id}:`, error.message);
      return NextResponse.json({ message: `Supabase error: ${error.message}` }, { status: 500 });
    }

    console.log(`[PATCH Order] Successfully updated order ${id}`);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`[PATCH Order] Critical server error for ID ${id}:`, error.message);
    return NextResponse.json(
      { message: "Failed to update order due to a server error.", details: error.message },
      { status: 500 }
    );
  }
}