
import React from 'react';
import { InvoiceLineItem } from '@/types/invoice';

interface InvoiceLineItemsProps {
  lineItems: InvoiceLineItem[];
}

const InvoiceLineItems: React.FC<InvoiceLineItemsProps> = ({ lineItems }) => {
  return (
    <div className="px-6 document-section overflow-x-auto">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">LINE ITEMS</h2>
      <table className="line-items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Rate</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td className="text-right">{item.quantity.toLocaleString()}</td>
              <td className="text-right">${item.rate.toLocaleString()}</td>
              <td className="text-right">${item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceLineItems;
