
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import type { Customer } from "@/types/customer";

interface NewCustomerFormProps {
  newCustomer: Omit<Customer, 'id'>;
  onCustomerChange: (customer: Omit<Customer, 'id'>) => void;
  onAddCustomer: () => void;
}

const NewCustomerForm: React.FC<NewCustomerFormProps> = ({
  newCustomer,
  onCustomerChange,
  onAddCustomer,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={newCustomer.name} 
            onChange={(e) => onCustomerChange({...newCustomer, name: e.target.value})}
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            value={newCustomer.address} 
            onChange={(e) => onCustomerChange({...newCustomer, address: e.target.value})}
            placeholder="Enter customer address"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={newCustomer.phone} 
            onChange={(e) => onCustomerChange({...newCustomer, phone: e.target.value})}
            placeholder="Enter customer phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={newCustomer.email} 
            onChange={(e) => onCustomerChange({...newCustomer, email: e.target.value})}
            placeholder="Enter customer email address"
          />
        </div>
      </div>
      
      <Button 
        onClick={onAddCustomer}
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
  );
};

export default NewCustomerForm;
