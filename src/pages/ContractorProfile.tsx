import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import AppLayout from '../components/layouts/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import ContractorLicenseSection from '@/components/profile/ContractorLicenseSection';
import ContractorPasswordSection from '@/components/profile/ContractorPasswordSection';
import ContractorPaymentMethodsSection from '@/components/profile/ContractorPaymentMethodsSection';
import ContractorContactSection from '@/components/profile/ContractorContactSection';

type ContractorProfileFormValues = {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
};

const ContractorProfile = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const form = useForm<ContractorProfileFormValues>({
    defaultValues: {
      companyName: "Bob's Construction",
      companyAddress: "123 Builder St, Construction City, CC 12345",
      companyPhone: "(555) 123-4567",
      companyEmail: "bob@bobconstruction.com"
    }
  });

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

  const onSubmit = (data: ContractorProfileFormValues) => {
    console.log("Profile data:", data);
    console.log("Logo:", logoPreview);
    
    toast({
      title: "Profile Saved",
      description: "Your company profile has been updated successfully.",
    });
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
                        <Input placeholder="Bob's Construction" {...field} />
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
                          placeholder="123 Builder St, Construction City, CC 12345" 
                          className="min-h-[80px]" 
                          {...field} 
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
                          <Input placeholder="(555) 123-4567" {...field} />
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
                          <Input placeholder="bob@bobconstruction.com" {...field} />
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

              <Separator className="my-6" />
              
              <ContractorContactSection />

              <Separator className="my-6" />
              
              <ContractorLicenseSection />

              <Separator className="my-6" />
              
              <ContractorPasswordSection />

              <Separator className="my-6" />
              
              <ContractorPaymentMethodsSection />
              
              <div className="pt-6 flex justify-end">
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Save Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractorProfile;
