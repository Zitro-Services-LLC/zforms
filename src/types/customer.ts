
export interface Customer {
  id: string;
  name: string;
  billingAddress: string;
  propertyAddress: string;
  sameAsBilling: boolean;
  phone: string;
  email: string;
}

export interface CustomerSelectionProps {
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNewCustomer: (customerData: Omit<Customer, 'id'>) => void;
}
