
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "@supabase/supabase-js/dist/module/lib/helpers";
import { useToast } from "@/hooks/use-toast";

/**
 * Upload a logo image to the contractor-logos bucket
 * @param file The image file to upload
 * @param userId The ID of the user uploading the logo
 * @returns The public URL of the uploaded logo
 */
export const uploadContractorLogo = async (file: File, userId: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('contractor-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading logo:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('contractor-logos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Delete a contractor logo from storage
 * @param userId The ID of the user who owns the logo
 * @param logoUrl The URL of the logo to delete
 */
export const deleteContractorLogo = async (userId: string, logoUrl: string): Promise<void> => {
  if (!logoUrl) return;

  try {
    // Extract the file path from the public URL
    const urlParts = logoUrl.split(`contractor-logos/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid logo URL format');
    }
    
    const filePath = urlParts[1];
    
    // Verify this is actually the user's logo (extra security check)
    if (!filePath.startsWith(`${userId}/`)) {
      throw new Error('Unauthorized logo deletion attempt');
    }
    
    const { error } = await supabase.storage
      .from('contractor-logos')
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting logo:', error);
    throw error;
  }
};
