
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";
import { generateInvoicePDF } from "./templates/invoice.ts";
import { generateEstimatePDF } from "./templates/estimate.ts";
import { generateContractPDF } from "./templates/contract.ts";
import { trackDocumentDownload } from "./utils.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { documentType, documentId } = await req.json();

    if (!documentType || !documentId) {
      throw new Error("Missing required parameters: documentType and documentId");
    }

    // Get the user from auth
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    // Get the JWT token from the authorization header
    const token = authHeader.replace("Bearer ", "");
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }
    
    const userId = user.id;
    
    // Create a service role client for storage operations
    const serviceRoleClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
    
    // Generate the PDF based on document type
    let pdfBytes;
    
    if (documentType === 'invoice') {
      pdfBytes = await generateInvoicePDF(serviceRoleClient, documentId, userId);
    } else if (documentType === 'estimate') {
      pdfBytes = await generateEstimatePDF(serviceRoleClient, documentId, userId);
    } else if (documentType === 'contract') {
      pdfBytes = await generateContractPDF(serviceRoleClient, documentId, userId);
    } else {
      throw new Error(`Unsupported document type: ${documentType}`);
    }
    
    // The folder path follows the structure: document-pdfs/{user-id}/{document-type}s/{document-id}-{timestamp}.pdf
    const fileName = `${documentId}-${Date.now()}.pdf`;
    const filePath = `${userId}/${documentType}s/${fileName}`;
    
    // Check if the storage bucket exists and create it if not
    const { data: buckets } = await serviceRoleClient
      .storage
      .listBuckets();
    
    if (!buckets.find(bucket => bucket.name === 'document-pdfs')) {
      const { error } = await serviceRoleClient
        .storage
        .createBucket('document-pdfs', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (error) throw new Error(`Error creating bucket: ${error.message}`);
    }
    
    // Upload the PDF to Storage
    const { error: uploadError } = await serviceRoleClient
      .storage
      .from('document-pdfs')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) throw new Error(`Error uploading PDF: ${uploadError.message}`);
    
    // Create a signed URL for the file
    const { data: signedUrlData, error: signedUrlError } = await serviceRoleClient
      .storage
      .from('document-pdfs')
      .createSignedUrl(filePath, 60); // 60 seconds expiry
    
    if (signedUrlError) throw new Error(`Error creating signed URL: ${signedUrlError.message}`);
    
    // Track the document download
    await trackDocumentDownload(
      serviceRoleClient, 
      documentId, 
      documentType, 
      userId, 
      filePath, 
      pdfBytes.length
    );
    
    return new Response(JSON.stringify({ fileUrl: signedUrlData.signedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
