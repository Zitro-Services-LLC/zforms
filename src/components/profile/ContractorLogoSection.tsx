
import React, { useState } from 'react';
import { Building, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </label>
            <input 
              id="logo-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={onLogoChange}
            />
            {logoPreview && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLogoPreview(null)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorLogoSection;
