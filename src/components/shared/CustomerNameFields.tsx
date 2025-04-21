
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Customer } from "@/types/customer";

// Type definition that exactly matches the schema in NewCustomerForm
type CustomerFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  billing_address?: string | null;
  property_address?: string | null;
  same_as_billing: boolean;
  profile_image_url?: string | null;
  user_id?: string;
};

interface CustomerNameFieldsProps {
  form: UseFormReturn<CustomerFormData>;
}

const CustomerNameFields: React.FC<CustomerNameFieldsProps> = ({ form }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="first_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Enter first name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="last_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Enter last name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default CustomerNameFields;
