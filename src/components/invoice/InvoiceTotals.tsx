
import React from 'react';
import { Status } from '../shared/StatusBadge';

interface InvoiceTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
  status: Status;
  amountPaid: number;
  balanceDue: number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  subtotal,
  tax,
  total,
  status,
  amountPaid,
  balanceDue
}) => {
  return (
    <div className="px-6 document-section">
      <div className="flex flex-col items-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="text-gray-900 font-medium">${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200">
            <span className="font-medium">Total</span>
            <span className="font-medium">${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Amount Paid</span>
            <span className="text-gray-900 font-medium">
              ${status === 'paid' 
                ? total.toLocaleString() 
                : amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 font-semibold text-lg border-t border-gray-200">
            <span>Balance Due</span>
            <span>${status === 'paid' ? '0.00' : balanceDue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
