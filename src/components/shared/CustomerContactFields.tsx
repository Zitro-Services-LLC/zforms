
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormData } from './NewCustomerForm';

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
            <Input placeholder="Enter customer phone number" {...field} value={field.value || ''} />
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
