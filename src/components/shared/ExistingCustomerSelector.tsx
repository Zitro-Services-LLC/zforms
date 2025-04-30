
import React, { useState } from 'react';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import NewCustomerForm from './NewCustomerForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExistingCustomerSelectorProps {
  onSelectCustomer: (customer: Customer | null) => void; 
  selectedCustomer: Customer | null;
  onAddNewCustomer?: (customer: Omit<Customer, 'id'>) => void;
  disabled?: boolean;
  customers: Customer[]; // Now required
  selectedCustomerId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  isError?: boolean;
}

const ExistingCustomerSelector: React.FC<ExistingCustomerSelectorProps> = ({
  onSelectCustomer,
  selectedCustomer,
  onAddNewCustomer,
  disabled = false,
  customers,
  selectedCustomerId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  isLoading = false,
  isError = false
}) => {
  const [open, setOpen] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  
  // Use controlled props if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const setIsOpen = setControlledOpen || setOpen;

  const handleSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    onSelectCustomer(customer || null);
    setIsOpen(false);
  };

  const handleAddNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    if (onAddNewCustomer) {
      onAddNewCustomer(customerData);
    }
    setShowNewCustomerDialog(false);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              "Loading customers..."
            ) : selectedCustomer
              ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
              : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            {isError ? (
              <CommandEmpty>Error loading customers.</CommandEmpty>
            ) : isLoading ? (
              <CommandEmpty>Loading customers...</CommandEmpty>
            ) : (
              <CommandList>
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup heading="Customers">
                  {customers.map(customer => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {customer.first_name} {customer.last_name} - {customer.email}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
            {onAddNewCustomer && (
              <div className="p-2 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsOpen(false);
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
