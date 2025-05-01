
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import CustomerPaymentMethodsSection from '@/components/profile/CustomerPaymentMethodsSection';
import AppLayout from '@/components/layouts/AppLayout';
import { getCustomerById } from '@/services/customerService';
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from '@/types/customer';

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => id ? getCustomerById(id) : Promise.reject('No customer ID provided'),
  });

  const handleUpdateSuccess = () => {
    toast({
      title: "Customer Updated",
      description: "Customer information has been updated successfully."
    });
  };

  const handleUpdateCustomer = (customerData: Omit<Customer, 'id'>) => {
    // This would typically call an API to update the customer
    toast({
      title: "Customer Updated",
      description: "Customer information has been updated successfully."
    });
  };

  const setCustomerData = (customerData: Omit<Customer, 'id'>) => {
    // This would typically update local state
    console.log('Customer data updated:', customerData);
  };

  if (isLoading) {
    return (
      <AppLayout userType="contractor">
        <div className="container mx-auto max-w-4xl my-8">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Loading customer information...</h1>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !customer) {
    return (
      <AppLayout userType="contractor">
        <div className="container mx-auto max-w-4xl my-8">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Error loading customer</h1>
          </div>
          <p className="text-red-500">Failed to load customer information.</p>
          <Button asChild className="mt-4">
            <Link to="/customers">Back to Customers</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto max-w-4xl my-8">
        <div className="flex items-center mb-6 gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Customer</h1>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Customer Information</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <NewCustomerForm 
                newCustomer={customer} 
                onCustomerChange={setCustomerData}
                onAddCustomer={handleUpdateCustomer}
                mode="edit"
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <CustomerPaymentMethodsSection
                customerId={id}
                isContractorView={true}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EditCustomer;
