
import React from 'react';

interface PartyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface ContractPartyInfoProps {
  contractor: PartyInfo;
  customer: PartyInfo;
}

const ContractPartyInfo: React.FC<ContractPartyInfoProps> = ({ contractor, customer }) => {
  return (
    <div className="p-6 document-header">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{contractor.name}</h2>
          <div className="text-sm text-gray-500 mt-1">
            <p>{contractor.address}</p>
            <p>{contractor.phone}</p>
            <p>{contractor.email}</p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500">CUSTOMER</h2>
          <p className="text-base font-medium text-gray-900">{customer.name}</p>
          <div className="text-sm text-gray-500 mt-1">
            <p>{customer.address}</p>
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPartyInfo;
