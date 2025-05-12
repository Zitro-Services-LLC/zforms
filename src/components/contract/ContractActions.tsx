
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Send, FileEdit, Trash } from "lucide-react";
import { ContractStatus } from '@/types/contract';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

interface ContractActionsProps {
  userType: 'contractor' | 'customer';
  status: ContractStatus;
  contractId: string;
  onStatusChange: (status: ContractStatus) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  userType,
  status,
  contractId,
  onStatusChange,
  onDelete,
  isDeleting
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t">
      {userType === 'contractor' ? (
        <div className="flex justify-between">
          {onDelete && (
            <DeleteConfirmDialog
              title="Delete Contract"
              description="Are you sure you want to delete this contract? This action cannot be undone."
              onDelete={onDelete}
              isDeleting={isDeleting}
              buttonLabel="Delete Contract"
              variant="outline"
            />
          )}
          
          <div className="flex space-x-4 ml-auto">
            {status === 'drafting' && (
              <Button 
                onClick={() => onStatusChange('submitted')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                Send to Customer
              </Button>
            )}
            
            {status === 'submitted' && (
              <Button 
                onClick={() => onStatusChange('approved')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Approved
              </Button>
            )}
            
            {(status === 'submitted' || status === 'needs-update') && (
              <Button 
                onClick={() => onStatusChange('drafting')}
                variant="outline"
              >
                <FileEdit className="mr-2 h-4 w-4" />
                Edit Contract
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && (
            <>
              <Button 
                onClick={() => onStatusChange('needs-update')}
                variant="outline"
              >
                Request Changes
              </Button>
              <Button 
                onClick={() => onStatusChange('approved')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Contract
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractActions;
