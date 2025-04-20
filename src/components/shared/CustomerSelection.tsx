
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NewCustomerForm from './NewCustomerForm';
import ExistingCustomerSelector from './ExistingCustomerSelector';
import type { Customer, CustomerSelectionProps } from '@/types/customer';

// Sample data - this would come from an API in a real app
const customers: Customer[] = [
  {
    id: '1',
    name: 'Alice Smith',
    address: '456 Home Ave, Hometown, HT 67890',
    phone: '(555) 987-6543',
    email: 'alice@example.com'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    address: '789 Oak St, Treeville, TV 45678',
    phone: '(555) 456-7890',
    email: 'bob.j@example.com'
  },
  {
    id: '3',
    name: 'Carol Williams',
    address: '321 Pine Dr, Forestcity, FC 98765',
    phone: '(555) 234-5678',
    email: 'carol.w@example.com'
  }
];

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
    const customer = customers.find(c => c.id === customerId);
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
