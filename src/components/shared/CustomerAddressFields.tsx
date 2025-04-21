
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormData>;
}

const CustomerAddressFields: React.FC<CustomerAddressFieldsProps> = ({ form }) => {
  const sameAsBilling = form.watch('same_as_billing');

  // Propagate address change if needed
  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billing_address');
      form.setValue('property_address', billingAddress || '');
    }
  }, [sameAsBilling, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="billing_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Billing Address</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter billing address"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="same_as_billing"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Property Address is same as Billing Address
            </FormLabel>
          </FormItem>
        )}
      />

      {!sameAsBilling && (
        <FormField
          control={form.control}
          name="property_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter property address"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CustomerAddressFields;
