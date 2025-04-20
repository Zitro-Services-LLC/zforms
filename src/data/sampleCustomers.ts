
import type { Customer } from '@/types/customer';

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    first_name: 'Alice',
    last_name: 'Smith',
    billing_address: '456 Home Ave, Hometown, HT 67890',
    property_address: '456 Home Ave, Hometown, HT 67890',
    same_as_billing: true,
    phone: '(555) 987-6543',
    email: 'alice@example.com',
    profile_image_url: null,
    user_id: undefined
  },
  {
    id: '2',
    first_name: 'Bob',
    last_name: 'Johnson',
    billing_address: '789 Oak St, Treeville, TV 45678',
    property_address: '123 Pine Rd, Treeville, TV 45678',
    same_as_billing: false,
    phone: '(555) 456-7890',
    email: 'bob.j@example.com',
    profile_image_url: null,
    user_id: undefined
  },
  {
    id: '3',
    first_name: 'Carol',
    last_name: 'Williams',
    billing_address: '321 Pine Dr, Forestcity, FC 98765',
    property_address: '321 Pine Dr, Forestcity, FC 98765',
    same_as_billing: true,
    phone: '(555) 234-5678',
    email: 'carol.w@example.com',
    profile_image_url: null,
    user_id: undefined
  }
];
