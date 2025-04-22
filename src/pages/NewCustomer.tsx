
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
    user_id: '',
  });

  const handleCustomerChange = (customer: Omit<Customer, 'id'>) => {
    setNewCustomer(customer);
  };

  const handleAddCustomer = async (customerData: Omit<Customer, 'id'>) => {
    if (!customerData.first_name || !customerData.last_name || !customerData.email) {
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
        throw new Error("Authentication required. Please log in to add customers.");
      }
      
      const customerToCreate = {
        ...customerData,
        user_id: user.id
      };

      const createdCustomer = await createCustomer(customerToCreate);
      
      toast({
        title: "Customer Created",
        description: `${createdCustomer.first_name} ${createdCustomer.last_name} has been added successfully.`
      });
      
      navigate('/customers');
    } catch (error: any) {
      console.error("Failed to create customer:", error);
      toast({
        title: "Error Creating Customer",
        description: error.message || "An unexpected error occurred while creating the customer.",
        variant: "destructive"
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
