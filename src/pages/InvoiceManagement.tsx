import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoicePartyInfo from '../components/invoice/InvoicePartyInfo';
import InvoiceReference from '../components/invoice/InvoiceReference';
import InvoiceLineItems from '../components/invoice/InvoiceLineItems';
import InvoicePaymentHistory from '../components/invoice/InvoicePaymentHistory';
import InvoiceTotals from '../components/invoice/InvoiceTotals';
import InvoicePaymentOptions from '../components/invoice/InvoicePaymentOptions';
import InvoiceActions from '../components/invoice/InvoiceActions';

// Mock data for the invoice
const invoiceData = {
  id: 'I-101',
  jobId: 'JOB-00123',
  estimateId: 'E-101',
  contractId: 'C-101',
  status: 'submitted' as Status,
  date: '2023-04-20',
  dueDate: '2023-05-05',
  contractor: {
    name: 'Bob\'s Construction',
    address: '123 Builder St, Construction City, CC 12345',
    phone: '(555) 123-4567',
    email: 'bob@bobconstruction.com'
  },
  customer: {
    name: 'Alice Smith',
    address: '456 Home Ave, Hometown, HT 67890',
    phone: '(555) 987-6543',
    email: 'alice@example.com'
  },
  lineItems: [
    { id: 1, description: 'Kitchen Cabinets - Premium Cherry', quantity: 1, rate: 7500, amount: 7500 },
    { id: 2, description: 'Countertops - Granite, 45 sq ft', quantity: 45, rate: 75, amount: 3375 },
    { id: 3, description: 'Flooring - Luxury Vinyl Tile, 200 sq ft', quantity: 200, rate: 10, amount: 2000 },
    { id: 4, description: 'Labor - Installation', quantity: 40, rate: 85, amount: 3400 }
  ],
  subtotal: 16275,
  tax: 1302,
  total: 17577,
  paymentHistory: [
    { id: 1, date: '2023-04-15', amount: 4394.25, method: 'Credit Card', note: 'Deposit (25%)' }
  ],
  balanceDue: 13182.75,
  paymentInstructions: {
    bankTransfer: {
      accountName: 'Bob\'s Construction LLC',
      accountNumber: '1234567890',
      routingNumber: '123456789',
      bankName: 'Builder\'s Bank'
    },
    creditCard: 'Secure online payment available via provided link'
  }
};

interface InvoiceManagementProps {
  userType?: 'contractor' | 'customer';
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status>(invoiceData.status);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  
  const handleMarkPaid = () => {
    setStatus('paid');
    console.log(`Invoice ${id} marked as paid`);
  };

  const handleMakePayment = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentSubmit = (method: string) => {
    setStatus('paid');
    console.log(`Payment made for invoice ${id} via ${method}`);
    setShowPaymentOptions(false);
  };

  const totalAmountPaid = invoiceData.paymentHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <InvoiceHeader
            id={invoiceData.id}
            jobId={invoiceData.jobId}
            date={invoiceData.date}
            dueDate={invoiceData.dueDate}
            status={status}
          />
          
          <InvoicePartyInfo
            contractor={invoiceData.contractor}
            customer={invoiceData.customer}
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
              onPaymentSubmit={handlePaymentSubmit}
            />
          )}

          <InvoiceActions
            userType={userType}
            status={status}
            onMarkPaid={handleMarkPaid}
            onMakePayment={handleMakePayment}
            showPaymentOptions={showPaymentOptions}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default InvoiceManagement;
