
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import type { LineItem } from '@/types/estimate';
import type { Customer } from '@/types/customer';
import { createEstimate } from '@/services/estimateService';

type EstimateStatus = "draft" | "submitted";

export function useNewEstimate() {
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
  const [taxRate, setTaxRate] = useState(8);
  const [isSaving, setIsSaving] = useState(false);
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionDisabledReason, setActionDisabledReason] = useState<string | null>(null);

  // Generate ref number
  const generateReferenceNumber = useCallback(() => {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateString =
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate());
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `EST-${dateString}-${rand}`;
  }, []);

  useEffect(() => {
    setReferenceNumber(generateReferenceNumber());
  }, [generateReferenceNumber]);

  // Totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  // Validation
  const isReferenceValid = referenceNumber.trim().length > 0;
  const isCustomerValid = !!selectedCustomer?.id;
  const isItemsValid = items.length > 0 && items.every(
    (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
  );
  const isTaxRateValid = !isNaN(taxRate) && taxRate >= 0 && taxRate <= 100;
  const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid && isTaxRateValid;

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

  // Item handlers
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

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      toast({
        title: "Customer Selected",
        description: `Selected ${customer.first_name} ${customer.last_name} for this estimate.`,
      });
    }
  };

  const handleAddNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    // Directly set and select the new customer after creation (should be called after createCustomer call in selector)
    setSelectedCustomer({
      ...customerData,
      id: ''
    });
  };

  // Save/submit logic
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

  const handleSaveDraft = async () => saveEstimate("draft");
  const handleSubmitToCustomer = async () => saveEstimate("submitted");
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

  return {
    selectedCustomer, setSelectedCustomer,
    items, setItems,
    notes, setNotes,
    estimateDate, setEstimateDate,
    referenceNumber, setReferenceNumber,
    showPreview, setShowPreview,
    taxRate, setTaxRate,
    isSaving,
    errorMessage,
    estimateStatus,
    actionDisabledReason,
    subtotal, tax, total,
    allRequiredValid,
    handleUpdateLineItem,
    handleDeleteLineItem,
    handleAddLineItem,
    handleCustomerSelect,
    handleAddNewCustomer,
    handleSaveDraft,
    handleSubmitToCustomer,
    handlePreview,
  };
}
