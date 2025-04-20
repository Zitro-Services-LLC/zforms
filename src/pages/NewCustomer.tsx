
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import NewCustomerForm from '@/components/shared/NewCustomerForm';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/types/customer';

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
    // TODO: Implement API call to add customer
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
