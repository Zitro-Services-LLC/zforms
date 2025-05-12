
import React from 'react';
import { Status } from '../shared/StatusBadge';
import InvoiceHeader from './InvoiceHeader';
import InvoicePartyInfo from './InvoicePartyInfo';
import InvoiceReference from './InvoiceReference';
import InvoiceLineItems from './InvoiceLineItems';
import InvoicePaymentHistory from './InvoicePaymentHistory';
import InvoiceTotals from './InvoiceTotals';
import InvoiceCustomerSection from './InvoiceCustomerSection';
import InvoicePaymentOptions from './InvoicePaymentOptions';
import InvoiceActions from './InvoiceActions';
import type { InvoiceData, PartyInfo, PaymentMethod } from '@/types';
import { useContractorData } from '@/hooks/useContractorData';
import { Loader2 } from 'lucide-react';

interface InvoiceDocumentProps {
  invoiceData: InvoiceData;
  userType: 'contractor' | 'customer';
  customer: PartyInfo;
  totalAmountPaid: number;
  showPaymentOptions: boolean;
  customerPaymentMethods: PaymentMethod[];
  onMarkPaid: () => void;
  onMakePayment: () => void;
  onPaymentSubmit: (method: string) => void;
  onRequestChanges: () => void;
  onSelectCustomer?: (customer: any) => void;
  onAddNewCustomer?: (customerData: any) => void;
  isLoading?: boolean;
  error?: any;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  invoiceData,
  userType,
  customer,
  totalAmountPaid,
  showPaymentOptions,
  customerPaymentMethods,
  onMarkPaid,
  onMakePayment,
  onPaymentSubmit,
  onRequestChanges,
  onSelectCustomer,
  onAddNewCustomer,
  isLoading,
  error
}) => {
  const { contractorData } = useContractorData();

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-10 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin h-8 w-8 text-amber-500 mb-4" />
        <p className="text-gray-500">Loading invoice data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-10 text-center">
        <h3 className="text-red-500 text-lg font-medium mb-2">Error Loading Invoice</h3>
        <p className="text-gray-500">{error.message || "Could not load invoice data. Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <InvoiceHeader
        id={invoiceData.id}
        jobId={invoiceData.jobId}
        date={invoiceData.date}
        dueDate={invoiceData.dueDate}
        status={invoiceData.status}
        companyLogo={contractorData?.logo_url}
      />
      
      {userType === 'contractor' && onSelectCustomer && onAddNewCustomer && (
        <InvoiceCustomerSection
          onSelectCustomer={onSelectCustomer}
          onAddNewCustomer={onAddNewCustomer}
        />
      )}
      
      <InvoicePartyInfo
        contractor={invoiceData.contractor}
        customer={customer}
      />
      
      <InvoiceReference
        estimateId={invoiceData.estimateId}
        contractId={invoiceData.contractId}
      />
      
      <InvoiceLineItems lineItems={invoiceData.lineItems} />
      
      <InvoicePaymentHistory
        payments={invoiceData.paymentHistory}
        status={invoiceData.status}
        balanceDue={invoiceData.balanceDue}
      />
      
      <InvoiceTotals
        subtotal={invoiceData.subtotal}
        tax={invoiceData.tax}
        total={invoiceData.total}
        status={invoiceData.status}
        amountPaid={totalAmountPaid}
        balanceDue={invoiceData.balanceDue}
      />

      {userType === 'customer' && invoiceData.status !== 'paid' && showPaymentOptions && (
        <InvoicePaymentOptions
          balanceDue={invoiceData.balanceDue}
          bankTransfer={invoiceData.paymentInstructions.bankTransfer}
          onPaymentSubmit={onPaymentSubmit}
          customerPaymentMethods={customerPaymentMethods}
        />
      )}

      <InvoiceActions
        userType={userType}
        status={invoiceData.status}
        onMarkPaid={onMarkPaid}
        onMakePayment={onMakePayment}
        onRequestChanges={onRequestChanges}
        showPaymentOptions={showPaymentOptions}
      />
    </div>
  );
};

export default InvoiceDocument;
