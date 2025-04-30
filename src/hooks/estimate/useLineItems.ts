
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { LineItem } from '@/types/estimate';

export function useLineItems(initialItems: LineItem[] = []) {
  const { toast } = useToast();
  const [items, setItems] = useState<LineItem[]>(
    initialItems.length > 0 
      ? initialItems 
      : [{ id: "1", description: '', quantity: 0, rate: 0, amount: 0 }]
  );

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleDeleteLineItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({
        title: "Cannot Delete",
        description: "At least one line item is required.",
        variant: "destructive"
      });
    }
  };

  const handleAddLineItem = () => {
    // Generate a unique string ID using timestamp
    const newId = `${Date.now()}`;
    setItems([...items, { id: newId, description: '', quantity: 0, rate: 0, amount: 0 }]);
  };

  // Calculate totals
  const calculateTotals = (taxRatePercent: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = subtotal * (taxRatePercent / 100);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  return {
    items,
    setItems,
    handleUpdateLineItem,
    handleDeleteLineItem,
    handleAddLineItem,
    calculateTotals
  };
}
