
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

interface ContactNameFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactNameFields: React.FC<ContactNameFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="contact_first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact First Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter first name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contact_last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter last name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
