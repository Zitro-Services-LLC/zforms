
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from '@/types/customer';

const NewCustomer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newCustomer, setNewCustomer] = React.useState<Omit<Customer, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    billing_address: '',
    property_address: '',
    same_as_billing: true,
  });

  const handleCustomerChange = (customer: Omit<Customer, 'id'>) => {
    setNewCustomer(customer);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.email) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the current user's ID to associate with the customer
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id;

      if (!user_id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add a customer",
          variant: "destructive"
        });
        return;
      }

      // Check if a customer already exists with this user_id
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user_id);

      if (existingCustomers && existingCustomers.length > 0) {
        // Since we can't modify the user_id column type and it might be used in policies,
        // we'll generate a unique identifier that matches the expected format
        // Create a unique string that starts with the user_id
        const uniqueId = `${user_id}-${Date.now()}`;
        
        // Insert the new customer into the database with the unique user_id
        const { error } = await supabase.from('customers').insert({
          user_id: uniqueId,
          first_name: newCustomer.first_name,
          last_name: newCustomer.last_name,
          email: newCustomer.email,
          phone: newCustomer.phone || null,
          billing_address: newCustomer.billing_address || null,
          property_address: newCustomer.property_address || null,
          same_as_billing: newCustomer.same_as_billing
        });

        if (error) throw error;
      } else {
        // If no customer exists with this user_id, we can use it directly
        const { error } = await supabase.from('customers').insert({
          user_id,
          first_name: newCustomer.first_name,
          last_name: newCustomer.last_name,
          email: newCustomer.email,
          phone: newCustomer.phone || null,
          billing_address: newCustomer.billing_address || null,
          property_address: newCustomer.property_address || null,
          same_as_billing: newCustomer.same_as_billing
        });

        if (error) throw error;
      }

      toast({
        title: "Customer Added",
        description: "The customer has been successfully added"
      });
      
      navigate('/customers');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout userType="contractor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        </div>
        <div className="max-w-2xl">
          <NewCustomerForm
            newCustomer={newCustomer}
            onCustomerChange={handleCustomerChange}
            onAddCustomer={handleAddCustomer}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCustomer;
