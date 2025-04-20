
import React from 'react';

interface InvoiceReferenceProps {
  estimateId: string;
  contractId: string;
}

const InvoiceReference: React.FC<InvoiceReferenceProps> = ({
  estimateId,
  contractId
}) => {
  return (
    <div className="px-6 pb-4">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">REFERENCE</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Estimate #:</span> 
            <span className="ml-2 text-gray-700">{estimateId}</span>
          </div>
          <div>
            <span className="text-gray-500">Contract #:</span> 
            <span className="ml-2 text-gray-700">{contractId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReference;
