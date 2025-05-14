
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { InvoiceLineItem } from '@/types/invoice';

interface InvoiceLineItemsFormProps {
  lineItems: InvoiceLineItem[];
  setLineItems: (items: InvoiceLineItem[]) => void;
}

const InvoiceLineItemsForm: React.FC<InvoiceLineItemsFormProps> = ({
  lineItems,
  setLineItems
}) => {
  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newLineItems = [...lineItems];
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) : parseFloat(newLineItems[index].quantity.toString());
      const rate = field === 'rate' ? parseFloat(value) : parseFloat(newLineItems[index].rate.toString());
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value,
        amount: quantity * rate
      };
    } else {
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value
      };
    }
    
    setLineItems(newLineItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems, 
      { 
        id: Date.now(), 
        description: '', 
        quantity: 1, 
        rate: 0, 
        amount: 0 
      }
    ]);
  };

  return (
    <div className="border-b pb-4">
      <h2 className="text-lg font-semibold mb-4">Line Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2 w-24">Quantity</th>
              <th className="text-right p-2 w-24">Rate</th>
              <th className="text-right p-2 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">
                  <Input 
                    value={item.description} 
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    className="text-right"
                    min="1"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    type="number" 
                    value={item.rate} 
                    onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
                    className="text-right"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="p-2 text-right">
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={4} className="p-2">
                <Button 
                  variant="outline" 
                  onClick={addLineItem}
                  className="w-full"
                >
                  Add Line Item
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoiceLineItemsForm;
