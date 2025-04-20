
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NewCustomerForm from './NewCustomerForm';
import ExistingCustomerSelector from './ExistingCustomerSelector';
import { sampleCustomers } from '@/data/sampleCustomers';
import type { Customer, CustomerSelectionProps } from '@/types/customer';

const CustomerSelection: React.FC<CustomerSelectionProps> = ({ onSelectCustomer, onAddNewCustomer }) => {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    first_name: '',
    last_name: '',
    billing_address: '',
    property_address: '',
    same_as_billing: true,
    phone: '',
    email: '',
    profile_image_url: null,
    user_id: undefined
  });

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (customer) {
      onSelectCustomer(customer);
    }
    setOpen(false);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.first_name || !newCustomer.email) {
      return;
    }
    // Simulate creating a customer with a temporary ID.
    const tempId = "new-" + Date.now();
    const customer: Customer = { id: tempId, ...newCustomer };
    // Notify the parent (trigger parent to show toast, select this customer)
    onAddNewCustomer(newCustomer);
    onSelectCustomer(customer);
    setSelectedCustomerId(tempId);
    setMode('existing');
    // Reset the new customer form for next use.
    setNewCustomer({
      first_name: '',
      last_name: '',
      billing_address: '',
      property_address: '',
      same_as_billing: true,
      phone: '',
      email: '',
      profile_image_url: null,
      user_id: undefined
    });
  };

  const selectedCustomer = 
    (mode === 'existing'
      ? sampleCustomers.find(c => c.id === selectedCustomerId)
      : null) ??
    (mode === 'new' && selectedCustomerId.startsWith('new-')
      ? { id: selectedCustomerId, ...newCustomer }
      : undefined);

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
          customers={sampleCustomers}
          selectedCustomer={selectedCustomer}
          selectedCustomerId={selectedCustomerId}
          open={open}
          onOpenChange={setOpen}
          onSelectCustomer={handleSelectCustomer}
        />
      )}

      {mode === 'new' && (
        <NewCustomerForm
          newCustomer={newCustomer}
          onCustomerChange={setNewCustomer}
          onAddCustomer={handleAddCustomer}
        />
      )}
    </div>
  );
};

export default CustomerSelection;
