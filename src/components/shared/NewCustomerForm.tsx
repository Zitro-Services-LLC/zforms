
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LogIn } from "lucide-react";
import type { Customer } from "@/types/customer";
import CustomerNameFields from './CustomerNameFields';
import CustomerAddressFields from './CustomerAddressFields';
import CustomerContactFields from './CustomerContactFields';

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
export type CustomerFormData = z.infer<typeof customerSchema>;

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
        <CustomerNameFields form={form} />
        <CustomerAddressFields form={form} />
        <CustomerContactFields form={form} />

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
