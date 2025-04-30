
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createEstimate } from '@/services/estimate';
import type { Customer } from '@/types/customer';
import type { LineItem } from '@/types/estimate';

type EstimateStatus = "draft" | "submitted";

export function useEstimateSaving(
  userId: string | undefined,
  selectedCustomer: Customer | null,
  items: LineItem[],
  notes: string,
  estimateDate: string,
  referenceNumber: string,
  jobNumber: string,
  jobDescription: string,
  taxRate: number,
  subtotal: number,
  tax: number,
  total: number,
  allRequiredValid: boolean
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");

  const saveEstimate = async (status: EstimateStatus) => {
    setErrorMessage(null);
    
    if (!userId) {
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
        description: "Please fill all required fields before proceeding",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await createEstimate({
        customer_id: selectedCustomer.id,
        user_id: userId,
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

  return {
    isSaving,
    errorMessage,
    estimateStatus,
    saveEstimate,
    handleSaveDraft,
    handleSubmitToCustomer
  };
}
