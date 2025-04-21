
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

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

interface CustomerContactFieldsProps {
  form: UseFormReturn<CustomerFormData>;
}

const CustomerContactFields: React.FC<CustomerContactFieldsProps> = ({ form }) => (
  <>
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input placeholder="Enter customer phone number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Enter customer email address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default CustomerContactFields;
