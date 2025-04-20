import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StatusBadge, { Status } from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

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

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Header */}
          <div className="px-6 pt-6 pb-3 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoiceData.id}</h1>
                <p className="text-sm text-gray-500">
                  Job #{invoiceData.jobId} | Date: {invoiceData.date} | Due: {invoiceData.dueDate}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <StatusBadge status={status} />
                <DownloadPdfButton documentType="invoice" documentId={invoiceData.id} />
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="p-6 document-header">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{invoiceData.contractor.name}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{invoiceData.contractor.address}</p>
                  <p>{invoiceData.contractor.phone}</p>
                  <p>{invoiceData.contractor.email}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500">BILL TO</h2>
                <p className="text-base font-medium text-gray-900">{invoiceData.customer.name}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{invoiceData.customer.address}</p>
                  <p>{invoiceData.customer.phone}</p>
                  <p>{invoiceData.customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Numbers */}
          <div className="px-6 pb-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">REFERENCE</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Estimate #:</span> 
                  <span className="ml-2 text-gray-700">{invoiceData.estimateId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Contract #:</span> 
                  <span className="ml-2 text-gray-700">{invoiceData.contractId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="px-6 document-section overflow-x-auto">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">LINE ITEMS</h2>
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity.toLocaleString()}</td>
                    <td className="text-right">${item.rate.toLocaleString()}</td>
                    <td className="text-right">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment History */}
          <div className="px-6 document-section">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">PAYMENT HISTORY</h2>
            {invoiceData.paymentHistory.length > 0 ? (
              <table className="line-items-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.date}</td>
                      <td>{payment.method}</td>
                      <td>{payment.note}</td>
                      <td className="text-right">${payment.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {status === 'paid' && (
                    <tr>
                      <td>{new Date().toLocaleDateString()}</td>
                      <td>Credit Card</td>
                      <td>Final Payment</td>
                      <td className="text-right">${invoiceData.balanceDue.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 italic">No payments recorded yet</p>
            )}
          </div>

          {/* Totals */}
          <div className="px-6 document-section">
            <div className="flex flex-col items-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${invoiceData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900 font-medium">${invoiceData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">${invoiceData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-gray-900 font-medium">${status === 'paid' 
                    ? invoiceData.total.toLocaleString() 
                    : invoiceData.paymentHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-semibold text-lg border-t border-gray-200">
                  <span>Balance Due</span>
                  <span>${status === 'paid' ? '0.00' : invoiceData.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options (for customer) */}
          {userType === 'customer' && status !== 'paid' && showPaymentOptions && (
            <div className="px-6 pt-4 pb-6 border-t border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md border border-gray-300 hover:border-amber-500 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Pay with Credit Card</h3>
                    <div className="flex space-x-1">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div className="w-10 h-6 bg-red-500 rounded"></div>
                      <div className="w-10 h-6 bg-green-500 rounded"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Fast and secure payment using your credit or debit card.</p>
                  <button 
                    onClick={() => handlePaymentSubmit('Credit Card')}
                    className="btn-amber w-full"
                  >
                    Pay ${invoiceData.balanceDue.toLocaleString()}
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-md border border-gray-300 hover:border-amber-500 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Bank Transfer</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Account Name: {invoiceData.paymentInstructions.bankTransfer.accountName}</p>
                    <p>Account #: {invoiceData.paymentInstructions.bankTransfer.accountNumber}</p>
                    <p>Routing #: {invoiceData.paymentInstructions.bankTransfer.routingNumber}</p>
                    <p>Bank: {invoiceData.paymentInstructions.bankTransfer.bankName}</p>
                  </div>
                  <button 
                    onClick={() => handlePaymentSubmit('Bank Transfer')}
                    className="btn-amber w-full"
                  >
                    Mark as Paid
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {userType === 'contractor' ? (
              <div className="flex justify-end space-x-4">
                {status === 'drafting' && (
                  <button className="btn-amber">
                    Submit to Customer
                  </button>
                )}
                {status === 'submitted' && (
                  <button 
                    onClick={handleMarkPaid}
                    className="btn-amber"
                  >
                    Mark as Paid
                  </button>
                )}
                {status !== 'paid' && status !== 'drafting' && (
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Revise Invoice
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                {status === 'submitted' && !showPaymentOptions && (
                  <button 
                    onClick={handleMakePayment}
                    className="btn-amber"
                  >
                    Make Payment
                  </button>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
};

export default InvoiceManagement;
