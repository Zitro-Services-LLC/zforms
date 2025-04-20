
import React from 'react';
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CustomerAddressSection from './CustomerAddressSection';
import CustomerContactSection from './CustomerContactSection';

export interface CustomerProfileFormValues {
  billingAddress: string;
  propertyAddress: string;
  sameAsBilling: boolean;
  phone: string;
  email: string;
}

const CustomerProfileForm = () => {
  const { toast } = useToast();
  
  const form = useForm<CustomerProfileFormValues>({
    defaultValues: {
      billingAddress: "123 Main St, Anytown, AT 12345",
      propertyAddress: "123 Main St, Anytown, AT 12345",
      sameAsBilling: true,
      phone: "(555) 123-4567",
      email: "customer@example.com"
    }
  });

  const onSubmit = (data: CustomerProfileFormValues) => {
    console.log("Profile data:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomerAddressSection form={form} />
        <CustomerContactSection form={form} />
        
        <div className="pt-6 flex justify-end">
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerProfileForm;
