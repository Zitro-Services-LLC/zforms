
import React from 'react';

interface PartyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface InvoicePartyInfoProps {
  contractor: PartyInfo;
  customer: PartyInfo;
}

const InvoicePartyInfo: React.FC<InvoicePartyInfoProps> = ({
  customer
}) => {
  return (
    <div className="p-6 document-header">
      <div className="w-full">
        <h2 className="text-sm font-semibold text-gray-500">BILL TO</h2>
        <p className="text-base font-medium text-gray-900">{customer.name}</p>
        <div className="text-sm text-gray-500 mt-1">
          <p>{customer.address}</p>
          <p>{customer.phone}</p>
          <p>{customer.email}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePartyInfo;
