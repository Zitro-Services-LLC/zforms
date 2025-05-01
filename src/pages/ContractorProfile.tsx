
import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layouts/AppLayout';
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import ContractorLicenseSection from '@/components/profile/ContractorLicenseSection';
import ContractorPasswordSection from '@/components/profile/ContractorPasswordSection';
import ContractorPaymentMethodsSection from '@/components/profile/ContractorPaymentMethodsSection';
import ContractorContactSection from '@/components/profile/ContractorContactSection';
import { useContractorData } from '@/hooks/useContractorData';
import ContractorLogoSection from '@/components/profile/ContractorLogoSection';
import ContractorCompanyForm from '@/components/profile/ContractorCompanyForm';
import { uploadContractorLogo } from '@/services/logoService';
import { useToast } from '@/hooks/use-toast';

const ContractorProfile = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const { toast } = useToast();
  const { loading, contractorData, updateContractorData } = useContractorData();
  
  const form = useForm({
    defaultValues: {
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: ''
    }
  });

  useEffect(() => {
    if (contractorData) {
      form.reset(contractorData);
      
      // Set logo preview if available
      if (contractorData.logo_url) {
        setLogoPreview(contractorData.logo_url);
      }
    }
  }, [contractorData, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let logoUrl = contractorData?.logo_url || null;
      
      // If a new logo was selected, upload it
      if (selectedLogo && contractorData?.user_id) {
        logoUrl = await uploadContractorLogo(selectedLogo, contractorData.user_id);
      }
      
      // Update contractor data including the logo URL
      await updateContractorData({
        ...data,
        logo_url: logoUrl
      });
      
      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully"
      });
      
      // Reset selected logo state since it's been uploaded
      setSelectedLogo(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout userType="contractor">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Company Profile</h1>
          
          <ContractorCompanyForm 
            form={form}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <ContractorLogoSection 
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            setLogoPreview={setLogoPreview}
          />

          <Separator className="my-6" />
          <ContractorContactSection />
          <Separator className="my-6" />
          <ContractorLicenseSection />
          <Separator className="my-6" />
          <ContractorPasswordSection />
          <Separator className="my-6" />
          <ContractorPaymentMethodsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractorProfile;
