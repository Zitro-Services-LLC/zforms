
import React from 'react';
import CustomerSelection from '../shared/CustomerSelection';

interface InvoiceCustomerSectionProps {
  onSelectCustomer: (customer: any) => void;
  onAddNewCustomer: (customerData: any) => void;
}

const InvoiceCustomerSection: React.FC<InvoiceCustomerSectionProps> = ({
  onSelectCustomer,
  onAddNewCustomer
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">CUSTOMER INFORMATION</h3>
      <CustomerSelection 
        onSelectCustomer={onSelectCustomer}
        onAddNewCustomer={onAddNewCustomer}
      />
    </div>
  );
};

export default InvoiceCustomerSection;
