
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_image_url?: string | null;
  billing_address: string | null;
  property_address: string | null;
  same_as_billing: boolean;
  user_id?: string;
}

export interface CustomerSelectionProps {
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNewCustomer: (customerData: Omit<Customer, 'id'>) => void;
}
