
import React from 'react';

interface BankTransfer {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

interface InvoicePaymentOptionsProps {
  balanceDue: number;
  bankTransfer: BankTransfer;
  onPaymentSubmit: (method: string) => void;
}

const InvoicePaymentOptions: React.FC<InvoicePaymentOptionsProps> = ({
  balanceDue,
  bankTransfer,
  onPaymentSubmit
}) => {
  return (
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
            onClick={() => onPaymentSubmit('Credit Card')}
            className="btn-amber w-full"
          >
            Pay ${balanceDue.toLocaleString()}
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
            <p>Account Name: {bankTransfer.accountName}</p>
            <p>Account #: {bankTransfer.accountNumber}</p>
            <p>Routing #: {bankTransfer.routingNumber}</p>
            <p>Bank: {bankTransfer.bankName}</p>
          </div>
          <button 
            onClick={() => onPaymentSubmit('Bank Transfer')}
            className="btn-amber w-full"
          >
            Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentOptions;
