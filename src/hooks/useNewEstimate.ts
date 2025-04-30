
import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import type { Customer } from '@/types/customer';
import { getCustomers } from '@/services/customerService';
import { generateReferenceNumber } from "@/utils/estimateUtils";
import { useQuery } from "@tanstack/react-query";
import { useEstimateValidation } from "./estimate/useEstimateValidation";
import { useLineItems } from "./estimate/useLineItems";
import { useEstimateImages } from "./estimate/useEstimateImages";
import { useEstimateSaving } from "./estimate/useEstimateSaving";

export function useNewEstimate() {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  // Basic state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState(generateReferenceNumber());
  const [jobNumber, setJobNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [taxRate, setTaxRate] = useState(8);

  // Line items management
  const {
    items, 
    setItems,
    handleUpdateLineItem, 
    handleDeleteLineItem, 
    handleAddLineItem,
    calculateTotals
  } = useLineItems();

  // Images management
  const {
    estimateImages,
    handleAddEstimateImage,
    handleRemoveEstimateImage
  } = useEstimateImages();

  // Calculate totals
  const { subtotal, tax, total } = calculateTotals(taxRate);

  // Validation
  const {
    isReferenceValid,
    isCustomerValid,
    isItemsValid,
    isTaxRateValid,
    allRequiredValid,
    actionDisabledReason
  } = useEstimateValidation(referenceNumber, selectedCustomer, items, taxRate);

  // Saving functionality
  const {
    isSaving,
    errorMessage,
    estimateStatus,
    handleSaveDraft,
    handleSubmitToCustomer
  } = useEstimateSaving(
    user?.id, 
    selectedCustomer, 
    items, 
    notes, 
    estimateDate, 
    referenceNumber,
    jobNumber,
    jobDescription,
    taxRate,
    subtotal,
    tax,
    total,
    allRequiredValid
  );

  // Fetch customers from the database
  const { 
    data: customers = [], 
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers
  } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: () => getCustomers(user?.id || ''),
    enabled: !!user?.id
  });

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      // No need to import toast here - we've eliminated that
      // direct dependency in this file
    }
  };

  const handleAddNewCustomer = (customerData: Omit<Customer, 'id'>) => {
    setSelectedCustomer({
      ...customerData,
      id: ''
    });
  };

  const handlePreview = () => {
    if (!allRequiredValid) {
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
    jobNumber, setJobNumber,
    jobDescription, setJobDescription,
    showPreview, setShowPreview,
    taxRate, setTaxRate,
    isSaving,
    errorMessage,
    estimateStatus,
    actionDisabledReason,
    subtotal, tax, total,
    allRequiredValid,
    estimateImages,
    customers,
    isLoadingCustomers,
    isErrorCustomers,
    handleUpdateLineItem,
    handleDeleteLineItem,
    handleAddLineItem,
    handleCustomerSelect,
    handleAddNewCustomer,
    handleSaveDraft,
    handleSubmitToCustomer,
    handlePreview,
    handleAddEstimateImage,
    handleRemoveEstimateImage,
  };
}
