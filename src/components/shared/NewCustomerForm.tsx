
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn } from "lucide-react";
import type { Customer } from "@/types/customer";

interface NewCustomerFormProps {
  newCustomer: Omit<Customer, 'id'>;
  onCustomerChange: (customer: Omit<Customer, 'id'>) => void;
  onAddCustomer: () => void;
}

const NewCustomerForm: React.FC<NewCustomerFormProps> = ({
  newCustomer,
  onCustomerChange,
  onAddCustomer,
}) => {
  const form = useForm<Omit<Customer, 'id'>>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      billing_address: '',
      property_address: '',
      same_as_billing: true,
    }
  });

  const sameAsBilling = form.watch('same_as_billing');

  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billing_address');
      form.setValue('property_address', billingAddress || '');
    }
  }, [sameAsBilling, form]);

  const onSubmit = (data: Omit<Customer, 'id'>) => {
    onCustomerChange(data);
    onAddCustomer();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit"
          className="mt-2 bg-amber-500 hover:bg-amber-600"
        >
          Add Customer
        </Button>
        
        <div className="mt-2 flex items-center text-xs text-amber-600">
          <LogIn className="mr-1 h-3 w-3" />
          <span>New customer will receive an email with login instructions.</span>
        </div>
      </form>
    </Form>
  );
};

export default NewCustomerForm;
