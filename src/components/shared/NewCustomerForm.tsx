
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
      name: '',
      email: '',
      phone: '',
      billingAddress: '',
      propertyAddress: '',
      sameAsBilling: true,
    }
  });

  const sameAsBilling = form.watch('sameAsBilling');

  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billingAddress');
      form.setValue('propertyAddress', billingAddress);
    }
  }, [sameAsBilling, form]);

  const onSubmit = (data: Omit<Customer, 'id'>) => {
    onCustomerChange(data);
    onAddCustomer();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingAddress"
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
            name="sameAsBilling"
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
              name="propertyAddress"
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
        </div>
        
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
