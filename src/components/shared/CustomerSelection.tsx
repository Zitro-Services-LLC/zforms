import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NewCustomerForm from './NewCustomerForm';
import ExistingCustomerSelector from './ExistingCustomerSelector';
import type { Customer, CustomerSelectionProps } from '@/types/customer';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { getCustomers, createCustomer } from '@/services/customerService';
import { useQuery } from '@tanstack/react-query';

const CustomerSelection: React.FC<CustomerSelectionProps> = ({ onSelectCustomer, onAddNewCustomer }) => {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    first_name: '',
    last_name: '',
    billing_address: '',
    property_address: '',
    same_as_billing: true,
    phone: '',
    email: '',
    profile_image_url: null,
    user_id: ''
  });

  // Fetch customers from Supabase, scoped by current user ID
  const { data: customers = [], isLoading, isError } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: () => getCustomers(user?.id),
    enabled: !!user?.id
  });

  // Update user_id in newCustomer when user changes
  useEffect(() => {
    if (user?.id) {
      setNewCustomer(prev => ({
        ...prev,
        user_id: user.id
      }));
    }
  }, [user]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      onSelectCustomer(customer);
    }
    setOpen(false);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.first_name || !newCustomer.email || !user?.id) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields or make sure you're logged in.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingCustomer(true);
    
    try {
      // Make sure the user_id is set correctly
      const customerToCreate = {
        ...newCustomer,
        user_id: user.id
      };
      
      // Create the customer in Supabase and get back the full object with ID
      const createdCustomer = await createCustomer(customerToCreate);
      
      // Notify parent components about the new customer (for any other logic they need to handle)
      onAddNewCustomer(customerToCreate);
      
      // Select this customer for the current form
      onSelectCustomer(createdCustomer);
      setSelectedCustomerId(createdCustomer.id);
      
      // Show success feedback
      toast({
        title: "Customer Created",
        description: `New customer ${createdCustomer.first_name} ${createdCustomer.last_name} has been added.`,
        variant: "default"
      });
      
      // Reset mode and form
      setMode('existing');
      setNewCustomer({
        first_name: '',
        last_name: '',
        billing_address: '',
        property_address: '',
        same_as_billing: true,
        phone: '',
        email: '',
        profile_image_url: null,
        user_id: user.id
      });
    } catch (error) {
      console.error("Failed to create customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue="existing"
        value={mode}
        onValueChange={(value) => setMode(value as 'existing' | 'new')}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="existing" />
          <Label htmlFor="existing">Select Existing Customer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new">Add New Customer</Label>
        </div>
      </RadioGroup>

      {mode === 'existing' && (
        <ExistingCustomerSelector
          customers={customers}
          selectedCustomer={selectedCustomer}
          selectedCustomerId={selectedCustomerId}
          open={open}
          onOpenChange={setOpen}
          onSelectCustomer={handleSelectCustomer}
          isLoading={isLoading}
          isError={isError}
        />
      )}

      {mode === 'new' && (
        <NewCustomerForm
          newCustomer={newCustomer}
          onCustomerChange={setNewCustomer}
          onAddCustomer={handleAddCustomer}
          loading={isSubmittingCustomer}
        />
      )}
    </div>
  );
};

export default CustomerSelection;
