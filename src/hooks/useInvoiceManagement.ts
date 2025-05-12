
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { PartyInfo, PaymentMethod } from '@/types';
import { useInvoice, useInvoices } from './useInvoices';
import { mapInvoiceToUI } from '@/utils/invoiceUtils';
import { useContractorData } from './useContractorData';
import { mockInvoiceData, mockCustomerPaymentMethods } from '@/mock/invoiceData';

export function useInvoiceManagement(invoiceId?: string, initialUserType: 'contractor' | 'customer' = 'contractor') {
  const { toast } = useToast();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [customer, setCustomer] = useState<PartyInfo>(mockInvoiceData.customer);
  const [customerPaymentMethods, setCustomerPaymentMethods] = useState<PaymentMethod[]>(mockCustomerPaymentMethods);
  
  // Fetch invoice data from Supabase using React Query
  const { data: invoiceData, isLoading, error } = useInvoice(invoiceId);
  const { markPaidMutation, recordPaymentMutation } = useInvoices();
  const { contractorData } = useContractorData();
  
  // Update customer when invoice data changes
  useEffect(() => {
    if (!isLoading && !error && invoiceData) {
      // Update customer info if available
      if (invoiceData.customer) {
        setCustomer({
          name: `${invoiceData.customer.first_name} ${invoiceData.customer.last_name}`,
          address: invoiceData.customer.billing_address || '',
          phone: invoiceData.customer.phone || '',
          email: invoiceData.customer.email,
          id: invoiceData.customer.id
        });
      }
    }
  }, [invoiceData, isLoading, error]);

  const handleMarkPaid = () => {
    if (invoiceId) {
      markPaidMutation.mutate(invoiceId, {
        onSuccess: () => {
          toast({
            title: "Invoice Marked as Paid",
            description: `Invoice #${invoiceId} has been marked as paid.`
          });
        }
      });
    }
  };

  const handleMakePayment = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentSubmit = (method: string) => {
    if (!invoiceId) return;
    
    recordPaymentMutation.mutate({
      invoice_id: invoiceId,
      payment_method: method,
      amount: invoiceData?.balance_due || 0,
      payment_date: new Date().toISOString().split('T')[0],
      notes: `Payment made via ${method}`
    }, {
      onSuccess: () => {
        toast({
          title: "Payment Successful",
          description: `Your payment for invoice #${invoiceId} via ${method} has been processed.`
        });
        setShowPaymentOptions(false);
      }
    });
  };
  
  const handleRequestChanges = (comments: string) => {
    setShowChangeRequestModal(false);
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor."
    });
  };
  
  const handleSelectCustomer = (selectedCustomer: PartyInfo) => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.name} for this invoice.`,
      });
    }
  };
  
  const handleAddNewCustomer = (customerData: PartyInfo) => {
    setCustomer({
      ...customerData,
      id: `CUST-${Math.floor(Math.random() * 1000)}`
    });
    toast({
      title: "New Customer Added",
      description: `Added ${customerData.name} as a new customer.`,
    });
  };
  
  // Calculate total amount paid
  const totalAmountPaid = invoiceData?.payments?.reduce(
    (sum, payment) => sum + payment.amount, 0
  ) || 0;

  // For now, return the mock data for UI rendering until all components are updated
  const uiInvoiceData = invoiceData ? mapInvoiceToUI(invoiceData, contractorData) : mockInvoiceData;
  
  return {
    invoiceData: uiInvoiceData,
    showPaymentOptions,
    showChangeRequestModal,
    customer,
    customerPaymentMethods,
    totalAmountPaid,
    handleMarkPaid,
    handleMakePayment,
    handlePaymentSubmit,
    handleRequestChanges,
    handleSelectCustomer,
    handleAddNewCustomer,
    setShowChangeRequestModal,
    isLoading,
    error
  };
}
