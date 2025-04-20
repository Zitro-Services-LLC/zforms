
import React from 'react';

interface ContractTotalProps {
  total: number;
}

const ContractTotal: React.FC<ContractTotalProps> = ({ total }) => {
  return (
    <div className="px-6 py-4 border-t border-gray-200 mt-6">
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2 font-semibold text-lg">
            <span>Total Contract Amount:</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTotal;
