
import React, { useState } from 'react';
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

const ContractorProfile = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { loading, contractorData, updateContractorData } = useContractorData();
  
  const form = useForm({
    defaultValues: {
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: ''
    }
  });

  React.useEffect(() => {
    if (contractorData) {
      form.reset(contractorData);
    }
  }, [contractorData, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout userType="contractor">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Company Profile</h1>
          
          <ContractorCompanyForm 
            form={form}
            onSubmit={updateContractorData}
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
