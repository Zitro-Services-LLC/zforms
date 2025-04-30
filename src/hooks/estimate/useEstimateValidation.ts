
import { useState, useEffect } from "react";
import type { LineItem } from '@/types/estimate';
import type { Customer } from '@/types/customer';

export interface ValidationState {
  isReferenceValid: boolean;
  isCustomerValid: boolean;
  isItemsValid: boolean;
  isTaxRateValid: boolean;
  allRequiredValid: boolean;
  actionDisabledReason: string | null;
}

export function useEstimateValidation(
  referenceNumber: string,
  selectedCustomer: Customer | null,
  items: LineItem[],
  taxRate: number
) {
  const [validationState, setValidationState] = useState<ValidationState>({
    isReferenceValid: false,
    isCustomerValid: false,
    isItemsValid: false,
    isTaxRateValid: false,
    allRequiredValid: false,
    actionDisabledReason: "Please complete all required fields"
  });

  useEffect(() => {
    const isReferenceValid = referenceNumber.trim().length > 0;
    const isCustomerValid = selectedCustomer?.id && selectedCustomer.id.length > 0;
    const isItemsValid = items.length > 0 && items.every(
      (item) => item.description.trim().length > 0 && item.quantity > 0 && item.rate > 0
    );
    const isTaxRateValid = !isNaN(taxRate) && taxRate >= 0 && taxRate <= 100;
    const allRequiredValid = isReferenceValid && isCustomerValid && isItemsValid && isTaxRateValid;

    let actionDisabledReason: string | null = null;
    if (!allRequiredValid) {
      if (!isReferenceValid) actionDisabledReason = "Please enter a valid reference number";
      else if (!isCustomerValid) actionDisabledReason = "Please select or add a valid customer";
      else if (!isItemsValid) actionDisabledReason = "Please provide valid line items (description, quantity > 0, rate > 0)";
      else if (!isTaxRateValid) actionDisabledReason = "Please enter a tax rate between 0 and 100";
      else actionDisabledReason = "Please complete all required fields";
    }

    setValidationState({
      isReferenceValid,
      isCustomerValid,
      isItemsValid,
      isTaxRateValid,
      allRequiredValid,
      actionDisabledReason
    });
  }, [referenceNumber, selectedCustomer, items, taxRate]);

  return validationState;
}
