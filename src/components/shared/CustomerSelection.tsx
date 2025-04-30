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

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customers = [], isLoading, isError } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: () => getCustomers(user?.id),
    enabled: !!user?.id
  });

  useEffect(() => {
    if (user?.id) {
      setNewCustomer(prev => ({
        ...prev,
        user_id: user.id
      }));
    }
  }, [user]);

  const handleSelectCustomer = (customer: Customer | null) => {
    setSelectedCustomerId(customer?.id || '');
    setSelectedCustomer(customer);
    onSelectCustomer(customer);
    setOpen(false);
  };

  const handleAddCustomer = async () => {
    if (
      !newCustomer.first_name ||
      !newCustomer.last_name ||
      !newCustomer.email ||
      !newCustomer.user_id
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: First Name, Last Name, and Email",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingCustomer(true);
    
    try {
      if (!user?.id) {
        throw new Error("Authentication required. Please log in to add customers.");
      }
      
      const customerToCreate = {
        ...newCustomer,
        user_id: user.id
      };

      const createdCustomer = await createCustomer(customerToCreate);
      
      onSelectCustomer(createdCustomer);
      setSelectedCustomerId(createdCustomer.id);
      
      toast({
        title: "Customer Created",
        description: `${createdCustomer.first_name} ${createdCustomer.last_name} has been added successfully.`
      });
      
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

      onAddNewCustomer(customerToCreate);
    } catch (error: any) {
      console.error("Failed to create customer:", error);
      toast({
        title: "Error Creating Customer",
        description: error.message || "An unexpected error occurred while creating the customer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

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
