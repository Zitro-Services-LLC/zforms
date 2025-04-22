
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabaseAuth } from './useSupabaseAuth';
import { getContractById } from '@/services/contractService';
import type { Status } from '@/components/shared/StatusBadge';
import type { Customer } from '@/types/customer';
import { useToast } from '@/components/ui/use-toast';

export function useContractData(id: string | undefined) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>('drafting');
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContractById(id!, user?.id),
    enabled: !!id && !!user?.id,
  });

  // Update status and customer when contract data is loaded
  React.useEffect(() => {
    if (contract) {
      setStatus(contract.status as Status);
      if (contract.customer) {
        setCustomer({
          id: contract.customer_id,
          name: `${contract.customer.first_name} ${contract.customer.last_name}`,
          address: contract.customer.billing_address || 'Address not provided',
          phone: contract.customer.phone || 'Phone not provided',
          email: contract.customer.email || 'Email not provided'
        });
      }
    }
  }, [contract]);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Contract status changed to ${newStatus}.`,
    });
  };

  return {
    contract,
    isLoading,
    isError,
    status,
    customer,
    handleStatusChange,
    setCustomer
  };
}
