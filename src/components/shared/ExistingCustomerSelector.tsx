
import React from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface ExistingCustomerSelectorProps {
  customers: Customer[];
  selectedCustomer: Customer | undefined;
  selectedCustomerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCustomer: (customerId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}

const ExistingCustomerSelector: React.FC<ExistingCustomerSelectorProps> = ({
  customers,
  selectedCustomer,
  selectedCustomerId,
  open,
  onOpenChange,
  onSelectCustomer,
  isLoading = false,
  isError = false,
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
            {selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : "Search Customer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search customer..." />
            {isLoading && (
              <div className="flex items-center justify-center p-4 text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading customers...
              </div>
            )}
            {isError && (
              <CommandEmpty className="py-6 text-center text-sm">
                Error loading customers. Please try again.
              </CommandEmpty>
            )}
            {!isLoading && !isError && (
              <>
                <CommandEmpty>No customer found.</CommandEmpty>
                {safeCustomers.length > 0 ? (
                  <CommandGroup>
                    {safeCustomers.map((customer) => (
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
                          <span>{`${customer.first_name} ${customer.last_name}`}</span>
                          <span className="text-xs text-muted-foreground">
                            {customer.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    No customers available.
                  </div>
                )}
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedCustomer && (
        <div className="rounded-md border p-4 text-sm">
          <div className="font-medium">{`${selectedCustomer.first_name} ${selectedCustomer.last_name}`}</div>
          <div className="text-muted-foreground mt-1">{selectedCustomer.billing_address}</div>
          <div className="text-muted-foreground">{selectedCustomer.phone}</div>
          <div className="text-muted-foreground">{selectedCustomer.email}</div>
        </div>
      )}
    </div>
  );
};

export default ExistingCustomerSelector;
