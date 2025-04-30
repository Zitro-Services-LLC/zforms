import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import type { LineItem } from '@/types/estimate';
import type { Customer } from '@/types/customer';
import { createEstimate } from '@/services/estimateService';
import { getCustomers } from '@/services/customerService';
import { generateReferenceNumber } from "@/utils/estimateUtils";
import { useQuery } from "@tanstack/react-query";

type EstimateStatus = "draft" | "submitted";

export function useNewEstimate() {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: '', quantity: 0, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [jobNumber, setJobNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [taxRate, setTaxRate] = useState(8);
  const [isSaving, setIsSaving] = useState(false);
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionDisabledReason, setActionDisabledReason] = useState<string | null>(null);
  const [estimateImages, setEstimateImages] = useState<File[]>([]);

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

  useEffect(() => {
    setReferenceNumber(generateReferenceNumber());
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const isReferenceValid = referenceNumber.trim().length > 0;
  const isCustomerValid = selectedCustomer?.id && selectedCustomer.id.length > 0;
  const isItemsValid = items.length > 0 && items.every(
    (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
  );
  const isTaxRateValid = !isNaN(taxRate) && taxRate >= 0 && taxRate <= 100;
  const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid && isTaxRateValid;

  useEffect(() => {
    if (allRequiredValid) {
      setActionDisabledReason(null);
    } else {
      if (!isReferenceValid) setActionDisabledReason("Please enter a valid reference number");
      else if (!isCustomerValid) setActionDisabledReason("Please select or add a valid customer");
      else if (!isItemsValid) setActionDisabledReason("Please provide valid line items (description, quantity > 0, rate > 0)");
      else if (!isTaxRateValid) setActionDisabledReason("Please enter a tax rate between 0 and 100");
      else setActionDisabledReason("Please complete all required fields");
    }
  }, [isReferenceValid, isCustomerValid, isItemsValid, isTaxRateValid, allRequiredValid]);

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
    setSelectedCustomer({
      ...customerData,
      id: ''
    });
  };
  
  const handleAddEstimateImage = (files: File[]) => {
    setEstimateImages(prev => [...prev, ...files]);
    if (files.length === 1) {
      toast({
        title: "Image Added",
        description: `${files[0].name} will be uploaded when saving the estimate.`,
      });
    } else {
      toast({
        title: "Images Added",
        description: `${files.length} images will be uploaded when saving the estimate.`,
      });
    }
  };

  const handleRemoveEstimateImage = (index: number) => {
    setEstimateImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "The image has been removed from the upload queue.",
    });
  };

  const saveEstimate = async (status: EstimateStatus) => {
    setErrorMessage(null);
    
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save estimates",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCustomer?.id) {
      toast({
        title: "Invalid Customer",
        description: "Please select a valid customer before saving",
        variant: "destructive",
      });
      return;
    }

    if (!allRequiredValid) {
      toast({
        title: `Cannot ${status === "draft" ? "Save" : "Submit"}`,
        description: actionDisabledReason || "Please fill all required fields before proceeding",
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
        status,
        job_number: jobNumber || undefined,
        job_description: jobDescription || undefined
      }, items);

      setEstimateStatus(status);
      toast({
        title: status === "draft" ? "Draft Saved" : "Estimate Submitted",
        description: status === "draft"
          ? "Your estimate draft was saved successfully"
          : "The estimate has been submitted to the customer",
      });
      
      navigate("/estimates");
    } catch (error: any) {
      const errorMessage = error.message || "Could not save estimate. Please try again.";
      console.error("Error saving estimate:", error);
      setErrorMessage(errorMessage);
      toast({
        title: `${status === "draft" ? "Save" : "Submit"} Error`,
        description: errorMessage,
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
