
import React from 'react';
import { calculateInvoiceTotal } from '@/utils/invoiceUtils';
import type { InvoiceLineItem } from '@/types/invoice';

interface InvoiceTotalsDisplayProps {
  lineItems: InvoiceLineItem[];
  taxRate: number;
}

const InvoiceTotalsDisplay: React.FC<InvoiceTotalsDisplayProps> = ({
  lineItems,
  taxRate
}) => {
  const subtotal = calculateInvoiceTotal(lineItems);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="py-4">
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2}></td>
            <td className="text-right p-2 font-medium">Subtotal:</td>
            <td className="text-right p-2">${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={2}></td>
            <td className="text-right p-2 font-medium">Tax ({taxRate}%):</td>
            <td className="text-right p-2">${tax.toFixed(2)}</td>
          </tr>
          <tr className="font-medium">
            <td colSpan={2}></td>
            <td className="text-right p-2">Total:</td>
            <td className="text-right p-2">${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTotalsDisplay;
