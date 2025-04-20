
import React from 'react';
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableLineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface EditableEstimateLineItemProps {
  item: EditableLineItem;
  onUpdate: (id: number, field: keyof EditableLineItem, value: string | number) => void;
  onDelete: (id: number) => void;
}

const EditableEstimateLineItem: React.FC<EditableEstimateLineItemProps> = ({
  item,
  onUpdate,
  onDelete,
}) => {
  const handleInputChange = (field: keyof EditableLineItem, value: string) => {
    if (field === 'quantity' || field === 'rate') {
      const numValue = parseFloat(value) || 0;
      onUpdate(item.id, field, numValue);
    } else {
      onUpdate(item.id, field, value);
    }
  };

  return (
    <tr className="border-b">
      <td className="py-2">
        <Input
          value={item.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full"
          placeholder="Enter description"
        />
      </td>
      <td className="py-2">
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          className="w-24 text-right"
          min="0"
        />
      </td>
      <td className="py-2">
        <Input
          type="number"
          value={item.rate}
          onChange={(e) => handleInputChange('rate', e.target.value)}
          className="w-24 text-right"
          min="0"
          step="0.01"
        />
      </td>
      <td className="py-2 text-right">
        ${(item.quantity * item.rate).toFixed(2)}
      </td>
      <td className="py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default EditableEstimateLineItem;
