
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactFormValues {
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  same_as_company: boolean;
}

interface ContactInfoFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  sameAsCompany: boolean;
}

export const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({ form, sameAsCompany }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Enter email address" 
                {...field}
                disabled={sameAsCompany} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter phone number" 
                {...field} 
                disabled={sameAsCompany}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
