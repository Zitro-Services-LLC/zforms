
import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import InvoiceReference from './InvoiceReference';
import InvoicePartyInfo from './InvoicePartyInfo';
import InvoiceLineItems from './InvoiceLineItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceActions from './InvoiceActions';
import InvoiceCustomerSection from './InvoiceCustomerSection';
import InvoicePaymentOptions from './InvoicePaymentOptions';
import InvoicePaymentHistory from './InvoicePaymentHistory';
import { Status } from '../shared/StatusBadge';
import { InvoiceData, PartyInfo } from '@/types/invoice';
import { PaymentMethod } from '@/types/paymentMethod';

interface InvoiceDocumentProps {
  invoiceData: InvoiceData | null;
  userType: 'contractor' | 'customer';
  customer?: PartyInfo | null;
  totalAmountPaid?: number;
  showPaymentOptions?: boolean;
  customerPaymentMethods?: PaymentMethod[];
  onMarkPaid?: () => void;
  onMakePayment?: () => void;
  onPaymentSubmit?: (amount: number, method: string, date: string) => void;
  onRequestChanges?: () => void;
  onSelectCustomer?: (customer: any) => void;
  onAddNewCustomer?: (customer: any) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  error?: any;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  invoiceData,
  userType,
  customer,
  totalAmountPaid = 0,
  showPaymentOptions = false,
  customerPaymentMethods = [],
  onMarkPaid,
  onMakePayment,
  onPaymentSubmit,
  onRequestChanges,
  onSelectCustomer,
  onAddNewCustomer,
  onDelete,
  isDeleting,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Invoice</h2>
        <p className="text-gray-700">
          {error ? error.message || "An unknown error occurred." : "Invoice data not found."}
        </p>
        <p className="mt-4 text-sm text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <InvoiceHeader
        id={invoiceData.id}
        jobId={invoiceData.jobId}
        status={invoiceData.status}
        date={invoiceData.date}
        dueDate={invoiceData.dueDate}
      />
      
      <InvoiceReference 
        estimateId={invoiceData.estimateId} 
        contractId={invoiceData.contractId}
      />
      
      {userType === 'contractor' && !customer && onSelectCustomer && onAddNewCustomer && (
        <InvoiceCustomerSection
          onSelectCustomer={onSelectCustomer}
          onAddNewCustomer={onAddNewCustomer}
        />
      )}
      
      <InvoicePartyInfo
        contractor={invoiceData.contractor}
        customer={customer || invoiceData.customer}
      />
      
      <InvoiceLineItems lineItems={invoiceData.lineItems} />
      
      <InvoiceTotals
        subtotal={invoiceData.subtotal}
        tax={invoiceData.tax}
        total={invoiceData.total}
        status={invoiceData.status}
        amountPaid={totalAmountPaid}
        balanceDue={invoiceData.balanceDue}
      />
      
      {invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0 && (
        <InvoicePaymentHistory 
          payments={invoiceData.paymentHistory} 
          status={invoiceData.status}
          balanceDue={invoiceData.balanceDue}
        />
      )}
      
      {showPaymentOptions && onPaymentSubmit && (
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
        onMarkPaid={onMarkPaid || (() => {})}
        onMakePayment={onMakePayment || (() => {})}
        showPaymentOptions={showPaymentOptions}
        onRequestChanges={onRequestChanges}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default InvoiceDocument;
