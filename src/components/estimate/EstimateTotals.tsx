
import React from 'react';

interface EstimateTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
  taxRate?: number;
}

const EstimateTotals: React.FC<EstimateTotalsProps> = ({ subtotal, tax, total, taxRate }) => {
  const displayedTaxRate = typeof taxRate === "number" ? taxRate : 8; // fallback if not provided
  return (
    <div className="px-6 document-section">
      <div className="flex flex-col items-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax ({displayedTaxRate}%)</span>
            <span className="text-gray-900 font-medium">${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateTotals;
