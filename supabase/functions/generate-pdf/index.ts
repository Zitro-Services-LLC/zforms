
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";
import { generateInvoicePDF, generateEstimatePDF, generateContractPDF } from "./templates/index.ts";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestUrl = new URL(req.url);
    const documentType = requestUrl.searchParams.get("type");
    const documentId = requestUrl.searchParams.get("id");
    const apiToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!documentType || !documentId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "Missing authorization token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create a Supabase client with the API token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${apiToken}` } } }
    );

    // Get user ID from the session
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(apiToken);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Generate PDF based on document type
    let pdfBytes: Uint8Array;

    switch (documentType) {
      case "invoice":
        pdfBytes = await generateInvoicePDF(supabaseClient, documentId, user.id);
        break;
      case "estimate":
        pdfBytes = await generateEstimatePDF(supabaseClient, documentId, user.id);
        break;
      case "contract":
        pdfBytes = await generateContractPDF(supabaseClient, documentId, user.id);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid document type" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }

    // Return the PDF
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${documentType}-${documentId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
