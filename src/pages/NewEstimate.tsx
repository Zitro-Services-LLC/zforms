
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
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { createEstimate } from '@/services/estimateService';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/types/customer';

// Generate a unique reference number for the estimate ("EST-YYYYMMDD-XXXX")
function generateReferenceNumber() {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString =
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate());
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `EST-${dateString}-${rand}`;
}

// Simple enum for estimate status
type EstimateStatus = "draft" | "submitted";

const NewEstimate = () => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: '', quantity: 0, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Editable tax rate (%) - default 8
  const [taxRate, setTaxRate] = useState(8);

  // Saving state and local estimate status
  const [isSaving, setIsSaving] = useState(false);
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Help state for showing why actions are disabled
  const [actionDisabledReason, setActionDisabledReason] = useState<string | null>(null);

  useEffect(() => {
    setReferenceNumber(generateReferenceNumber());
  }, []);

  // Totals calculation
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  // Form validation
  const isReferenceValid = referenceNumber.trim().length > 0;
  const isCustomerValid = !!selectedCustomer?.id;
  const isItemsValid = items.length > 0 && items.every(
    (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
  );
  const isTaxRateValid = !isNaN(taxRate) && taxRate >= 0 && taxRate <= 100;
  const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid && isTaxRateValid;

  // Display message if actions are disabled
  useEffect(() => {
    if (allRequiredValid) {
      setActionDisabledReason(null);
    } else {
      if (!isReferenceValid) setActionDisabledReason("Please enter a reference number.");
      else if (!isCustomerValid) setActionDisabledReason("Please select or add a customer.");
      else if (!isItemsValid) setActionDisabledReason("Please provide valid line items (description, quantity > 0, rate > 0).");
      else if (!isTaxRateValid) setActionDisabledReason("Please enter a tax rate between 0 and 100.");
      else setActionDisabledReason("Please complete all required fields.");
    }
  }, [isReferenceValid, isCustomerValid, isItemsValid, isTaxRateValid, allRequiredValid]);

  // Line item handlers
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

  // Customer selection handler 
  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      toast({
        title: "Customer Selected",
        description: `Selected ${customer.first_name} ${customer.last_name} for this estimate.`,
      });
    }
  };

  // Handle new customer added via form
  const handleAddNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    // This is now handled directly in CustomerSelection component
    console.log("New customer will be created:", customerData);
  };

  // Save estimate draft
  const handleSaveDraft = async () => {
    await saveEstimate("draft");
  };

  // Submit estimate to Supabase
  const handleSubmitToCustomer = async () => {
    await saveEstimate("submitted");
  };

  const saveEstimate = async (status: EstimateStatus) => {
    setErrorMessage(null);
    
    if (!allRequiredValid) {
      toast({
        title: `Cannot ${status === "draft" ? "Save" : "Submit"}`,
        description: "Please fill all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCustomer?.id) {
      toast({
        title: "Invalid Customer",
        description: "Please select a valid customer with a database ID.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Attempting to save estimate with customer ID: ${selectedCustomer.id}`);
    setIsSaving(true);
    
    try {
      const result = await createEstimate({
        customer_id: selectedCustomer.id,
        user_id: user.id,
        title: referenceNumber,
        date: estimateDate,
        subtotal,
        tax_rate: taxRate,
        tax_amount: tax,
        total,
        notes,
        status
      }, items);

      setEstimateStatus(status);
      toast({
        title: status === "draft" ? "Draft Saved" : "Estimate Submitted",
        description: status === "draft" 
          ? "Your estimate draft was saved successfully." 
          : "The estimate has been submitted to the customer.",
        variant: "default"
      });
      
      // Navigate to estimates list after successful save
      navigate("/estimates");
    } catch (error: any) {
      console.error("Save error:", error);
      const errorMsg = error.message || "Could not save estimate. Please try again.";
      setErrorMessage(errorMsg);
      toast({
        title: `${status === "draft" ? "Save" : "Submit"} Error`,
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview estimate
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

        {/* Show feedback to user */}
        {((!allRequiredValid || isSaving) || errorMessage) && (
          <div className="mb-4">
            <div className={`border-l-4 px-4 py-2 rounded text-sm ${
              errorMessage 
                ? "bg-red-100 border-red-300 text-red-800" 
                : "bg-yellow-100 border-yellow-300 text-yellow-800"
            }`}>
              {isSaving
                ? "Saving, please wait..."
                : errorMessage || actionDisabledReason}
            </div>
          </div>
        )}

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
            onAddNewCustomer={handleAddNewCustomer}
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
            taxRate={taxRate}
          />

          {/* Show new Submit to Customer button if draft (and valid & not saving) */}
          {estimateStatus === "draft" && allRequiredValid && !isSaving && (
            <div className="flex justify-end pt-4">
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleSubmitToCustomer}
                disabled={!allRequiredValid || isSaving}
              >
                Submit Estimate to Customer
              </Button>
            </div>
          )}

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
