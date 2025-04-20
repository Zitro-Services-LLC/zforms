
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, UserRound, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface CustomerSelectionProps {
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNewCustomer: (customerData: Omit<Customer, 'id'>) => void;
}

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
    // Basic validation
    if (!newCustomer.name || !newCustomer.email) {
      return;
    }
    onAddNewCustomer(newCustomer);
    onSelectCustomer(null); // Clear any selected customer
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
        <div className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCustomer ? selectedCustomer.name : "Search Customer"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search customer..." />
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id}
                      onSelect={() => handleSelectCustomer(customer.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomerId === customer.id 
                            ? "opacity-100" 
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {customer.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedCustomer && (
            <div className="rounded-md border p-4 text-sm">
              <div className="font-medium">{selectedCustomer.name}</div>
              <div className="text-muted-foreground mt-1">{selectedCustomer.address}</div>
              <div className="text-muted-foreground">{selectedCustomer.phone}</div>
              <div className="text-muted-foreground">{selectedCustomer.email}</div>
            </div>
          )}
        </div>
      )}

      {mode === 'new' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newCustomer.name} 
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={newCustomer.address} 
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                placeholder="Enter customer address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newCustomer.phone} 
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="Enter customer phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={newCustomer.email} 
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="Enter customer email address"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddCustomer}
            type="button"
            className="mt-2 bg-amber-500 hover:bg-amber-600"
          >
            Add Customer
          </Button>
          
          <div className="mt-2 flex items-center text-xs text-amber-600">
            <LogIn className="mr-1 h-3 w-3" />
            <span>New customer will receive an email with login instructions.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSelection;
