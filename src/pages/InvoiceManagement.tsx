
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import InvoiceDocument from '../components/invoice/InvoiceDocument';
import ChangeRequestModal from '../components/shared/ChangeRequestModal';
import { useInvoiceManagement } from '@/hooks/useInvoiceManagement';
import { deleteInvoice } from '@/services/invoice/invoiceMutations';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface InvoiceManagementProps {
  userType?: 'contractor' | 'customer';
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    invoiceData,
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
  } = useInvoiceManagement(id, userType);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
      navigate('/invoices');
    },
    onError: (error) => {
      toast({
        title: "Error deleting invoice",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const handleDeleteInvoice = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <InvoiceDocument
          invoiceData={invoiceData}
          userType={userType}
          customer={customer}
          totalAmountPaid={totalAmountPaid}
          showPaymentOptions={showPaymentOptions}
          customerPaymentMethods={customerPaymentMethods}
          onMarkPaid={handleMarkPaid}
          onMakePayment={handleMakePayment}
          onPaymentSubmit={handlePaymentSubmit}
          onRequestChanges={() => setShowChangeRequestModal(true)}
          onSelectCustomer={userType === 'contractor' ? handleSelectCustomer : undefined}
          onAddNewCustomer={userType === 'contractor' ? handleAddNewCustomer : undefined}
          onDelete={userType === 'contractor' ? handleDeleteInvoice : undefined}
          isDeleting={deleteMutation.isPending}
          isLoading={isLoading}
          error={error}
        />
        
        <ChangeRequestModal
          isOpen={showChangeRequestModal}
          onClose={() => setShowChangeRequestModal(false)}
          onSubmit={handleRequestChanges}
          documentType="invoice"
        />
      </div>
    </AppLayout>
  );
};

export default InvoiceManagement;
