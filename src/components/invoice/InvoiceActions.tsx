
import React from 'react';
import { Status } from '../shared/StatusBadge';

interface InvoiceActionsProps {
  userType: 'contractor' | 'customer';
  status: Status;
  onMarkPaid: () => void;
  onMakePayment: () => void;
  showPaymentOptions: boolean;
  onRequestChanges?: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  userType,
  status,
  onMarkPaid,
  onMakePayment,
  showPaymentOptions,
  onRequestChanges
}) => {
  return (
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
              onClick={onMarkPaid}
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
            <>
              {onRequestChanges && (
                <button 
                  onClick={onRequestChanges}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Request Changes
                </button>
              )}
              <button 
                onClick={onMakePayment}
                className="btn-amber"
              >
                Make Payment
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceActions;
