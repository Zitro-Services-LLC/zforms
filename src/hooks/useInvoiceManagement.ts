
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Status } from '@/components/shared/StatusBadge';
import type { PaymentMethod } from '@/types/paymentMethod';
import { mockInvoiceData, mockCustomerPaymentMethods } from '@/mock/invoiceData';

interface Customer {
  name: string;
  address: string;
  phone: string;
  email: string;
  id?: string;
}

export function useInvoiceManagement(invoiceId?: string, initialUserType: 'contractor' | 'customer' = 'contractor') {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(mockInvoiceData.status);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [customer, setCustomer] = useState(mockInvoiceData.customer);
  const [customerPaymentMethods, setCustomerPaymentMethods] = useState<PaymentMethod[]>(mockCustomerPaymentMethods);
  
  const handleMarkPaid = () => {
    setStatus('paid');
    toast({
      title: "Invoice Marked as Paid",
      description: `Invoice #${invoiceId} has been marked as paid.`
    });
  };

  const handleMakePayment = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentSubmit = (method: string) => {
    setStatus('paid');
    toast({
      title: "Payment Successful",
      description: `Your payment for invoice #${invoiceId} via ${method} has been processed.`
    });
    setShowPaymentOptions(false);
  };
  
  const handleRequestChanges = (comments: string) => {
    setStatus('needs-update');
    setShowChangeRequestModal(false);
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor."
    });
  };
  
  const handleSelectCustomer = (selectedCustomer: any) => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.name} for this invoice.`,
      });
    }
  };
  
  const handleAddNewCustomer = (customerData: any) => {
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
  const totalAmountPaid = mockInvoiceData.paymentHistory.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    invoiceData: mockInvoiceData,
    status,
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
    setShowChangeRequestModal
  };
}
