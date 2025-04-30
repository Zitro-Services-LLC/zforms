
import React, { useState } from 'react';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import NewCustomerForm from './NewCustomerForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Sample data with complete Customer type properties
const customers = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    property_address: '123 Main St',
    billing_address: '123 Main St',
    same_as_billing: true,
    user_id: 'user_1'
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    property_address: '456 Oak Ave',
    billing_address: '456 Oak Ave',
    same_as_billing: true,
    user_id: 'user_1'
  },
  {
    id: '3',
    first_name: 'Robert',
    last_name: 'Johnson',
    email: 'robert@example.com',
    phone: '555-333-4444',
    property_address: '789 Pine Rd',
    billing_address: '789 Pine Rd',
    same_as_billing: true,
    user_id: 'user_1'
  },
];

interface ExistingCustomerSelectorProps {
  onSelectCustomer: (customer: Customer | null) => void; // Updated to accept Customer object
  selectedCustomer: Customer | null;
  onAddNewCustomer?: (customer: Omit<Customer, 'id'>) => void;
  disabled?: boolean;
}

const ExistingCustomerSelector: React.FC<ExistingCustomerSelectorProps> = ({
  onSelectCustomer,
  selectedCustomer,
  onAddNewCustomer,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);

  const handleSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    onSelectCustomer(customer || null);
    setOpen(false);
  };

  const handleAddNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    if (onAddNewCustomer) {
      onAddNewCustomer(customerData);
    }
    setShowNewCustomerDialog(false);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedCustomer
              ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
              : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers.map(customer => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customer.first_name} {customer.last_name} - {customer.email}
                </CommandItem>
              ))}
            </CommandGroup>
            {onAddNewCustomer && (
              <div className="p-2 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setOpen(false);
                    setShowNewCustomerDialog(true);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Customer
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {onAddNewCustomer && (
        <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <NewCustomerForm onAddCustomer={handleAddNewCustomer} newCustomer={{
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              billing_address: '',
              property_address: '',
              same_as_billing: true,
              profile_image_url: null,
              user_id: ''
            }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExistingCustomerSelector;
