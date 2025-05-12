
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import InvoiceDocument from '../components/invoice/InvoiceDocument';
import ChangeRequestModal from '../components/shared/ChangeRequestModal';
import { useInvoiceManagement } from '@/hooks/useInvoiceManagement';

interface InvoiceManagementProps {
  userType?: 'contractor' | 'customer';
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  
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
