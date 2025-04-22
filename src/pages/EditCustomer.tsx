import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/layouts/AppLayout';
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCustomerById, updateCustomer } from '@/services/customerService';
import type { Customer } from '@/types/customer';

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [customerData, setCustomerData] = React.useState<Omit<Customer, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    billing_address: '',
    property_address: '',
    same_as_billing: true,
    profile_image_url: null,
    user_id: undefined
  });

  const { data: customer, isLoading: isLoadingCustomer, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => updateCustomer(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      queryClient.refetchQueries({ queryKey: ['customers'] });
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      navigate('/customers', { state: { forceRefetch: true } });
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive"
      });
    }
  });

  React.useEffect(() => {
    if (customer) {
      setCustomerData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone || '',
        billing_address: customer.billing_address || '',
        property_address: customer.property_address || '',
        same_as_billing: customer.same_as_billing,
        profile_image_url: customer.profile_image_url,
        user_id: customer.user_id
      });
    }
  }, [customer]);

  const handleUpdateCustomer = (freshData: Omit<Customer, 'id'>) => {
    console.log("[EditCustomer] Saving customer data:", freshData);
    updateCustomerMutation.mutate(freshData);
  };

  if (isLoadingCustomer) {
    return (
      <AppLayout userType="contractor">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </AppLayout>
    );
  }

  if (isError || !id) {
    return (
      <AppLayout userType="contractor">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/customers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
          <div className="text-center py-8 text-red-500">
            Customer not found or error loading customer data.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userType="contractor">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
        </div>
        <div className="max-w-2xl">
          <NewCustomerForm
            newCustomer={customerData}
            onCustomerChange={setCustomerData}
            onAddCustomer={handleUpdateCustomer}
            loading={updateCustomerMutation.isPending}
            mode="edit"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditCustomer;
