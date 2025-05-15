
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Track document downloads in the database
export async function trackDocumentDownload(supabase, documentId, documentType, userId, filePath, fileSize) {
  const { error } = await supabase
    .from('document_downloads')
    .insert({
      user_id: userId,
      document_type: documentType,
      document_id: documentId,
      file_path: filePath,
      file_size: fileSize,
      version: new Date().toISOString()
    });
  
  if (error) {
    console.error("Error tracking document download:", error);
  }
}
