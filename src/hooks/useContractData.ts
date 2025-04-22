
import { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (contract) {
      setStatus(contract.status as Status);
      if (contract.customer) {
        setCustomer({
          id: contract.customer_id,
          first_name: contract.customer.first_name,
          last_name: contract.customer.last_name,
          email: contract.customer.email || '',
          phone: contract.customer.phone || null,
          billing_address: contract.customer.billing_address || null,
          property_address: contract.customer.property_address || null,
          same_as_billing: true,
          user_id: contract.user_id,
          profile_image_url: null
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
