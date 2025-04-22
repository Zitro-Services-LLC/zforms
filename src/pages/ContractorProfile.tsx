import React, { useState } from 'react';
import AppLayout from '../components/layouts/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building, Upload, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import ContractorLicenseSection from '@/components/profile/ContractorLicenseSection';
import ContractorPasswordSection from '@/components/profile/ContractorPasswordSection';
import ContractorPaymentMethodsSection from '@/components/profile/ContractorPaymentMethodsSection';
import ContractorContactSection from '@/components/profile/ContractorContactSection';
import { useContractorData, ContractorFormData } from '@/hooks/useContractorData';

const ContractorProfile = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { loading, contractorData, updateContractorData } = useContractorData();
  
  const form = useForm<ContractorFormData>({
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

  const onSubmit = async (data: ContractorFormData) => {
    await updateContractorData(data);
  };

  return (
    <AppLayout userType="contractor">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Company Profile</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter company address" 
                          className="min-h-[80px]" 
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company phone" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company email" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
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
                        onChange={handleLogoChange}
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

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>

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
