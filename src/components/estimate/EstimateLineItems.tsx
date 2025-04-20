
import React from 'react';

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface EstimateLineItemsProps {
  items: LineItem[];
}

const EstimateLineItems: React.FC<EstimateLineItemsProps> = ({ items }) => {
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
          {items.map((item) => (
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

export default EstimateLineItems;
