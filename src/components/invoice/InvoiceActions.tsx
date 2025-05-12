
import React from 'react';
import { Status } from '../shared/StatusBadge';
import { Button } from "@/components/ui/button";
import { CheckCircle, Send, FileEdit, CreditCard } from "lucide-react";

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
            <Button variant="default" className="bg-amber-500 hover:bg-amber-600">
              <Send className="mr-2 h-4 w-4" />
              Submit to Customer
            </Button>
          )}
          {status === 'submitted' && (
            <Button 
              onClick={onMarkPaid}
              variant="default"
              className="bg-amber-500 hover:bg-amber-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}
          {status !== 'paid' && status !== 'drafting' && (
            <Button variant="outline">
              <FileEdit className="mr-2 h-4 w-4" />
              Revise Invoice
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && !showPaymentOptions && (
            <>
              {onRequestChanges && (
                <Button 
                  onClick={onRequestChanges}
                  variant="outline"
                >
                  Request Changes
                </Button>
              )}
              <Button 
                onClick={onMakePayment}
                variant="default"
                className="bg-amber-500 hover:bg-amber-600"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceActions;
