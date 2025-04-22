
import CustomerSelection from '../shared/CustomerSelection';
import type { Customer } from '@/types/customer';
import { useToast } from '@/components/ui/use-toast';

interface ContractCustomerSectionProps {
  onSelectCustomer: (customer: Customer) => void;
  onAddNewCustomer: (customerData: any) => void;
}

export const ContractCustomerSection: React.FC<ContractCustomerSectionProps> = ({
  onSelectCustomer,
  onAddNewCustomer,
}) => {
  const { toast } = useToast();

  const handleSelectCustomer = (selectedCustomer: Customer) => {
    onSelectCustomer(selectedCustomer);
    toast({
      title: "Customer Selected",
      description: `Selected ${selectedCustomer.first_name} ${selectedCustomer.last_name} for this contract.`,
    });
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-b">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">CUSTOMER INFORMATION</h3>
      <CustomerSelection 
        onSelectCustomer={handleSelectCustomer}
        onAddNewCustomer={onAddNewCustomer}
      />
    </div>
  );
};
