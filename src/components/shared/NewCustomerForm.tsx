
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn } from "lucide-react";
import type { Customer } from "@/types/customer";

// Define form validation schema
const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  billing_address: z.string().optional().nullable(),
  property_address: z.string().optional().nullable(),
  same_as_billing: z.boolean().default(true),
  profile_image_url: z.string().nullable().optional(),
  user_id: z.string().optional()
});

// Create a type for the form data based on the schema
type CustomerFormData = z.infer<typeof customerSchema>;

interface NewCustomerFormProps {
  newCustomer: Omit<Customer, 'id'>;
  onCustomerChange: (customer: Omit<Customer, 'id'>) => void;
  onAddCustomer: () => void;
  loading?: boolean;
  mode?: "add" | "edit";
}

const NewCustomerForm: React.FC<NewCustomerFormProps> = ({
  newCustomer,
  onCustomerChange,
  onAddCustomer,
  loading = false,
  mode = "add"
}) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: newCustomer.first_name || '',
      last_name: newCustomer.last_name || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      billing_address: newCustomer.billing_address || '',
      property_address: newCustomer.property_address || '',
      same_as_billing: newCustomer.same_as_billing,
      profile_image_url: newCustomer.profile_image_url || null,
      user_id: newCustomer.user_id
    }
  });

  // Get 'same_as_billing' value from the form
  const sameAsBilling = form.watch('same_as_billing');

  // Effect to update the form with the latest customer data
  React.useEffect(() => {
    form.reset({
      first_name: newCustomer.first_name || '',
      last_name: newCustomer.last_name || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      billing_address: newCustomer.billing_address || '',
      property_address: newCustomer.same_as_billing
        ? newCustomer.billing_address || ''
        : newCustomer.property_address || '',
      same_as_billing: newCustomer.same_as_billing,
      profile_image_url: newCustomer.profile_image_url || null,
      user_id: newCustomer.user_id
    });
  }, [newCustomer, form]);

  // Effect to update property_address when same_as_billing changes
  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billing_address');
      form.setValue('property_address', billingAddress || '');
    }
  }, [sameAsBilling, form]);

  const onSubmit = (data: CustomerFormData) => {
    const customerData: Omit<Customer, 'id'> = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone || null,
      billing_address: data.billing_address || null,
      property_address: data.property_address || null,
      same_as_billing: data.same_as_billing,
      profile_image_url: data.profile_image_url || null,
      user_id: newCustomer.user_id
    };

    onCustomerChange(customerData);
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
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
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
          disabled={loading}
        >
          {loading
            ? (mode === 'edit' ? "Updating..." : "Adding Customer...")
            : (mode === 'edit' ? "Update Customer" : "Add Customer")}
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
