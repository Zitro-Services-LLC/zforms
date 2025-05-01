
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

interface InvoiceDocumentProps {
  invoiceData: InvoiceData;
  status: Status;
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
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  invoiceData,
  status,
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
  onAddNewCustomer
}) => {
  const { contractorData } = useContractorData();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <InvoiceHeader
        id={invoiceData.id}
        jobId={invoiceData.jobId}
        date={invoiceData.date}
        dueDate={invoiceData.dueDate}
        status={status}
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
        status={status}
        balanceDue={invoiceData.balanceDue}
      />
      
      <InvoiceTotals
        subtotal={invoiceData.subtotal}
        tax={invoiceData.tax}
        total={invoiceData.total}
        status={status}
        amountPaid={totalAmountPaid}
        balanceDue={invoiceData.balanceDue}
      />

      {userType === 'customer' && status !== 'paid' && showPaymentOptions && (
        <InvoicePaymentOptions
          balanceDue={invoiceData.balanceDue}
          bankTransfer={invoiceData.paymentInstructions.bankTransfer}
          onPaymentSubmit={onPaymentSubmit}
          customerPaymentMethods={customerPaymentMethods}
        />
      )}

      <InvoiceActions
        userType={userType}
        status={status}
        onMarkPaid={onMarkPaid}
        onMakePayment={onMakePayment}
        onRequestChanges={onRequestChanges}
        showPaymentOptions={showPaymentOptions}
      />
    </div>
  );
};

export default InvoiceDocument;
