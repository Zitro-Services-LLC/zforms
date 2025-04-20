
import React from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface ExistingCustomerSelectorProps {
  customers: Customer[];
  selectedCustomer: Customer | undefined;
  selectedCustomerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCustomer: (customerId: string) => void;
}

const ExistingCustomerSelector: React.FC<ExistingCustomerSelectorProps> = ({
  customers,
  selectedCustomer,
  selectedCustomerId,
  open,
  onOpenChange,
  onSelectCustomer,
}) => {
  // Ensure customers is an array, even if it's undefined
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={onOpenChange}>
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
              {safeCustomers.length > 0 ? (
                safeCustomers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.id}
                    onSelect={() => onSelectCustomer(customer.id)}
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
                ))
              ) : (
                <CommandItem disabled>No customers available</CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedCustomer && (
        <div className="rounded-md border p-4 text-sm">
          <div className="font-medium">{selectedCustomer.name}</div>
          <div className="text-muted-foreground mt-1">{selectedCustomer.billingAddress}</div>
          <div className="text-muted-foreground">{selectedCustomer.phone}</div>
          <div className="text-muted-foreground">{selectedCustomer.email}</div>
        </div>
      )}
    </div>
  );
};

export default ExistingCustomerSelector;
