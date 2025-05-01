
import React, { useState } from 'react';
import { Building, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { uploadContractorLogo, deleteContractorLogo } from "@/services/logoService";

interface ContractorLogoSectionProps {
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLogoPreview: (logo: string | null) => void;
}

const ContractorLogoSection: React.FC<ContractorLogoSectionProps> = ({
  logoPreview,
  onLogoChange,
  setLogoPreview
}) => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [uploading, setUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload a logo",
        variant: "destructive"
      });
      return;
    }

    const file = e.target.files[0];
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Logo image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      // Create a preview for immediate UI feedback
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload to Supabase storage
      const logoUrl = await uploadContractorLogo(file, user.id);
      
      // The actual update of the contractor profile with the logo URL
      // will be handled by the parent component via the onLogoChange callback
      onLogoChange(e);
      
      toast({
        title: "Logo Updated",
        description: "Your company logo has been updated successfully"
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      });
      setLogoPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!user || !logoPreview) return;
    
    try {
      setUploading(true);
      
      // If this is a previously saved logo (not just a preview), delete it from storage
      if (logoPreview.includes('contractor-logos')) {
        await deleteContractorLogo(user.id, logoPreview);
      }
      
      setLogoPreview(null);
      
      toast({
        title: "Logo Removed",
        description: "Your company logo has been removed"
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove logo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-t pt-6">
      <h2 className="text-lg font-semibold mb-4">Company Logo</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Company logo preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <Building className="h-16 w-16 text-gray-300" />
            )}
          </div>
        </div>
        <div className="flex-grow space-y-4">
          <p className="text-sm text-gray-500">Upload your company logo. Recommended size: Square or 2:1 ratio.</p>
          <div className="flex items-center gap-4">
            <label 
              htmlFor="logo-upload" 
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Choose File"}</span>
            </label>
            <input 
              id="logo-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleLogoChange}
              disabled={uploading}
            />
            {logoPreview && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRemoveLogo}
                disabled={uploading}
              >
                {uploading ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorLogoSection;
