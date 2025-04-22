
import React from 'react';
import { Status } from '../shared/StatusBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { updateContractStatus, createContractRevision } from '@/services/contractService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from "@/components/ui/use-toast";

interface ContractActionsProps {
  userType: 'contractor' | 'customer';
  status: Status;
  contractId: string;
  onStatusChange: (newStatus: Status) => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({ 
  userType, 
  status, 
  contractId,
  onStatusChange 
}) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  
  const handleApproveContract = async () => {
    try {
      await updateContractStatus(contractId, 'approved');
      onStatusChange('approved');
      toast({
        title: "Contract Approved",
        description: "The contract has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReviseContract = async (comments: string) => {
    if (!user?.id) return;
    
    try {
      await Promise.all([
        updateContractStatus(contractId, 'needs-update'),
        createContractRevision(contractId, user.id, comments)
      ]);
      
      onStatusChange('needs-update');
      toast({
        title: "Revision Requested",
        description: "The contract revision request has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request contract revision. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      {userType === 'contractor' ? (
        <div className="flex justify-end space-x-4">
          {status === 'drafting' && (
            <Button variant="default">
              Submit to Customer
            </Button>
          )}
          {status === 'submitted' && (
            <Button 
              onClick={() => onStatusChange('approved')}
            >
              Mark as Approved
            </Button>
          )}
          {status !== 'drafting' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  Revise Contract
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Contract Revision</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will notify all parties that the contract needs to be updated. Please provide your revision comments below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Enter your revision comments here..."
                  id="revisionComments"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const comments = (document.getElementById('revisionComments') as HTMLTextAreaElement).value;
                      handleReviseContract(comments);
                    }}
                  >
                    Submit Revision
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    Request Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Request Contract Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide details about the changes you need.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="Describe the changes needed..."
                    id="customerRevisionComments"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const comments = (document.getElementById('customerRevisionComments') as HTMLTextAreaElement).value;
                        handleReviseContract(comments);
                      }}
                    >
                      Submit Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                onClick={handleApproveContract}
              >
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
