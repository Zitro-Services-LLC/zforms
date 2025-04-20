
import React from 'react';
import { Status } from '../shared/StatusBadge';

interface ContractSignaturesProps {
  status: Status;
  contractorName: string;
  customerName: string;
  date: string;
}

const ContractSignatures: React.FC<ContractSignaturesProps> = ({
  status,
  contractorName,
  customerName,
  date,
}) => {
  return (
    <div className="px-6 pt-4 pb-6 border-t">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Signatures</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">CONTRACTOR SIGNATURE</h3>
          <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 italic">Electronically signed by {contractorName}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Date: {date}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">CUSTOMER SIGNATURE</h3>
          <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
            {status === 'approved' ? (
              <span className="text-gray-400 italic">Electronically signed by {customerName}</span>
            ) : (
              <span className="text-gray-400 italic">Awaiting signature</span>
            )}
          </div>
          {status === 'approved' && (
            <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractSignatures;
