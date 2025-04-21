
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { createCustomer } from '@/services/customerService';
import type { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewCustomer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState<Omit<Customer, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    billing_address: '',
    property_address: '',
    same_as_billing: true,
    user_id: '', // This will be set in handleAddCustomer
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
      setLoading(true);
      
      if (!user?.id) {
        console.error("No authenticated user found");
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add a customer",
          variant: "destructive"
        });
        return;
      }

      console.log("Current authenticated user:", user.id);
      console.log("Attempting to create customer with data:", {
        ...newCustomer,
        user_id: user.id
      });

      // Create a complete customer object with the user_id
      const customerToCreate = {
        ...newCustomer,
        user_id: user.id
      };

      // Use the customerService to create the customer
      const result = await createCustomer(customerToCreate);
      console.log("Customer creation result:", result);

      toast({
        title: "Customer Added",
        description: "The customer has been successfully added"
      });
      
      navigate('/customers');
    } catch (error: any) {
      console.error("Error adding customer:", error);
      // Log more detailed error information
      if (error.error) console.error("Error details:", error.error);
      if (error.code) console.error("Error code:", error.code);
      if (error.details) console.error("Error details:", error.details);
      if (error.hint) console.error("Error hint:", error.hint);
      
      toast({
        title: "Error creating customer",
        description: error.message || JSON.stringify(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout userType="contractor">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        </div>
        <div className="max-w-2xl">
          <NewCustomerForm
            newCustomer={newCustomer}
            onCustomerChange={handleCustomerChange}
            onAddCustomer={handleAddCustomer}
            loading={loading}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCustomer;
