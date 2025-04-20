
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layouts/AppLayout';
import EstimateFormHeader from '../components/estimate/EstimateFormHeader';
import EstimateDetailsSection from '../components/estimate/EstimateDetailsSection';
import EstimateItemsSection from '../components/estimate/EstimateItemsSection';
import EstimateNotesSection from '../components/estimate/EstimateNotesSection';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimatePreviewDialog from '../components/estimate/EstimatePreviewDialog';
import { useToast } from "@/hooks/use-toast";
import type { LineItem } from '@/types/estimate';
import { Button } from '@/components/ui/button';

function generateReferenceNumber() {
  // Example: "EST-20240420-123456" (timestamp-based for uniqueness)
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString =
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate());
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `EST-${dateString}-${rand}`;
}

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

  // New: Editable tax rate (as %)
  const [taxRate, setTaxRate] = useState(8);

  // Track status for save
  const [isSaving, setIsSaving] = useState(false);

  // Generate a reference number suggestion if empty on load
  useEffect(() => {
    if (!referenceNumber) {
      setReferenceNumber(generateReferenceNumber());
    }
  }, []); // Only run on mount

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const isReferenceValid = referenceNumber.trim().length > 0;
  const isCustomerValid = !!selectedCustomer;
  const isItemsValid = items.length > 0 && items.every(
    (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
  );
  const isTaxRateValid = !isNaN(taxRate) && taxRate >= 0 && taxRate <= 100;
  const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid && isTaxRateValid;

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
        variant: "default"
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
            taxRate={taxRate}
            onTaxRateChange={setTaxRate}
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

          {/* More prominent Save/Submit Estimate button */}
          <div className="flex flex-col items-end mt-8">
            <Button
              size="lg"
              className="w-64 text-lg font-semibold"
              disabled={!allRequiredValid || isSaving}
              onClick={handleSaveDraft}
            >
              Save Estimate
            </Button>
          </div>
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
