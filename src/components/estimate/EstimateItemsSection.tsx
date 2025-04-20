
import React from 'react';
import { Button } from '@/components/ui/button';
import EditableEstimateLineItem from './EditableEstimateLineItem';
import { LineItem } from '@/types/estimate';
import { useToast } from "@/hooks/use-toast";

interface EstimateItemsSectionProps {
  items: LineItem[];
  onUpdateItem: (id: number, field: keyof LineItem, value: string | number) => void;
  onDeleteItem: (id: number) => void;
  onAddItem: () => void;
}

const EstimateItemsSection: React.FC<EstimateItemsSectionProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}) => {
  return (
    <div className="border-b pb-6">
      <h2 className="text-lg font-semibold mb-4">Line Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Description</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <EditableEstimateLineItem
                key={item.id}
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onAddItem}
      >
        Add Line Item
      </Button>
    </div>
  );
};

export default EstimateItemsSection;
