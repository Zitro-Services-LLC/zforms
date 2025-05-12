
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useCustomerSelection(initialCustomer: any = null) {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(initialCustomer);

  const handleSelectCustomer = (selectedCustomer: any) => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.name} for this estimate.`,
      });
    }
  };
  
  const handleAddNewCustomer = (customerData: any) => {
    setCustomer({
      ...customerData,
      id: `CUST-${Math.floor(Math.random() * 1000)}`
    });
    toast({
      title: "New Customer Added",
      description: `Added ${customerData.name} as a new customer.`,
    });
  };

  return {
    customer,
    setCustomer,
    handleSelectCustomer,
    handleAddNewCustomer
  };
}
