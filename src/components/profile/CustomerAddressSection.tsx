
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from 'react-hook-form';
import type { CustomerProfileFormValues } from './CustomerProfileForm';

interface CustomerAddressSectionProps {
  form: UseFormReturn<CustomerProfileFormValues>;
}

const CustomerAddressSection: React.FC<CustomerAddressSectionProps> = ({ form }) => {
  const sameAsBilling = form.watch('same_as_billing');

  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billing_address');
      form.setValue('property_address', billingAddress);
    }
  }, [sameAsBilling, form]);

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CustomerAddressSection;
