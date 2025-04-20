
export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CustomerSelectionProps {
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNewCustomer: (customerData: Omit<Customer, 'id'>) => void;
}
