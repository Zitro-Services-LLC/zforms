
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface ContactFormValues {
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  same_as_company: boolean;
}

interface ContactSameAsCompanyFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactSameAsCompanyField: React.FC<ContactSameAsCompanyFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="same_as_company"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Use company contact information
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
