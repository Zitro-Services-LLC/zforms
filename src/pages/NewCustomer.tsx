
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/types/customer';

function getStoredCustomers(): Customer[] {
  const local = window.localStorage.getItem('customers');
  try {
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

function saveCustomers(customers: Customer[]) {
  window.localStorage.setItem('customers', JSON.stringify(customers));
}

const NewCustomer = () => {
  const navigate = useNavigate();
  const [newCustomer, setNewCustomer] = React.useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    billingAddress: '',
    propertyAddress: '',
    sameAsBilling: true,
  });

  const handleCustomerChange = (customer: Omit<Customer, 'id'>) => {
    setNewCustomer(customer);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;
    // Save to localStorage
    const allCustomers = getStoredCustomers();
    const id = 'new-' + Date.now();
    const customer: Customer = { id, ...newCustomer };
    saveCustomers([...allCustomers, customer]);
    navigate('/customers');
  };

  return (
    <AppLayout userType="contractor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        </div>
        <div className="max-w-2xl">
          <NewCustomerForm
            newCustomer={newCustomer}
            onCustomerChange={handleCustomerChange}
            onAddCustomer={handleAddCustomer}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCustomer;
