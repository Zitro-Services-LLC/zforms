
import React, { useState } from 'react';
import AppLayout from '../components/layouts/AppLayout';
import EstimateFormHeader from '../components/estimate/EstimateFormHeader';
import EstimateDetailsSection from '../components/estimate/EstimateDetailsSection';
import EstimateItemsSection from '../components/estimate/EstimateItemsSection';
import EstimateNotesSection from '../components/estimate/EstimateNotesSection';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimatePreviewDialog from '../components/estimate/EstimatePreviewDialog';
import { useToast } from "@/hooks/use-toast";
import type { LineItem } from '@/types/estimate';

const NewEstimate = () => {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: '', quantity: 0, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Track status for save
  const [isSaving, setIsSaving] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const isReferenceValid = referenceNumber.trim().length > 0;
  const isCustomerValid = !!selectedCustomer;
  const isItemsValid = items.length > 0 && items.every(
    (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
  );
  const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid;

  const handleUpdateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleDeleteLineItem = (id: number) => {
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
    const newId = Math.max(...items.map(item => item.id)) + 1;
    setItems([...items, { id: newId, description: '', quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    if (customer) {
      toast({
        title: "Customer Selected",
        description: `Selected ${customer.name} for this estimate.`,
      });
    }
  };

  // Save estimate draft
  const handleSaveDraft = () => {
    if (!allRequiredValid) {
      toast({
        title: "Cannot Save",
        description: "Please fill all required fields before saving.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Draft Saved",
        description: "Your estimate draft was saved successfully.",
        variant: "default" // Changed from "success" to "default"
      });
    }, 1000);
  };

  // Preview handler
  const handlePreview = () => {
    if (!allRequiredValid) {
      toast({
        title: "Cannot Preview",
        description: "Please complete all required fields before previewing.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <EstimateFormHeader
          onPreview={handlePreview}
          onSave={handleSaveDraft}
          disableActions={!allRequiredValid || isSaving}
        />

        <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <EstimateDetailsSection
            estimateDate={estimateDate}
            referenceNumber={referenceNumber}
            onDateChange={setEstimateDate}
            onReferenceChange={setReferenceNumber}
            onCustomerSelect={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
          />

          <EstimateItemsSection
            items={items}
            onUpdateItem={handleUpdateLineItem}
            onDeleteItem={handleDeleteLineItem}
            onAddItem={handleAddLineItem}
          />

          <EstimateNotesSection
            notes={notes}
            onNotesChange={setNotes}
          />

          <EstimateTotals 
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>

      <EstimatePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        estimateData={{
          id: referenceNumber || 'Draft',
          customer: selectedCustomer,
          items,
          subtotal,
          tax,
          total,
          notes,
        }}
      />
    </AppLayout>
  );
};

export default NewEstimate;
