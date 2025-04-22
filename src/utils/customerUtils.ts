
import type { Customer } from '@/types/customer';

// PartyInfo is the expected type for ContractPartyInfo component
export interface PartyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export function customerToPartyInfo(customer: Customer | null): PartyInfo {
  if (!customer) {
    return {
      name: 'Customer information not available',
      address: '',
      phone: '',
      email: ''
    };
  }

  return {
    name: `${customer.first_name} ${customer.last_name}`,
    address: customer.billing_address || '',
    phone: customer.phone || '',
    email: customer.email
  };
}
