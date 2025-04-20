
import type { Customer } from '@/types/customer';

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alice Smith',
    billingAddress: '456 Home Ave, Hometown, HT 67890',
    propertyAddress: '456 Home Ave, Hometown, HT 67890',
    sameAsBilling: true,
    phone: '(555) 987-6543',
    email: 'alice@example.com'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    billingAddress: '789 Oak St, Treeville, TV 45678',
    propertyAddress: '123 Pine Rd, Treeville, TV 45678',
    sameAsBilling: false,
    phone: '(555) 456-7890',
    email: 'bob.j@example.com'
  },
  {
    id: '3',
    name: 'Carol Williams',
    billingAddress: '321 Pine Dr, Forestcity, FC 98765',
    propertyAddress: '321 Pine Dr, Forestcity, FC 98765',
    sameAsBilling: true,
    phone: '(555) 234-5678',
    email: 'carol.w@example.com'
  }
];
