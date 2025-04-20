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
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
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
    if (!newCustomer.name || !newCustomer.email) {
      return;
    }
    onAddNewCustomer(newCustomer);
    onSelectCustomer(null);
  };

  const selectedCustomer = sampleCustomers.find(c => c.id === selectedCustomerId);

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
