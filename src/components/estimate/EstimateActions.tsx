
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Pencil, Check, Trash } from "lucide-react";
import { Status } from '../shared/StatusBadge';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

interface EstimateActionsProps {
  status: Status;
  userType: 'contractor' | 'customer';
  onApprove: () => void;
  onRequestChanges: () => void;
  onMarkApproved: () => void;
  onRevise: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  showCommentBox: boolean;
  commentText: string;
  onCommentChange: (text: string) => void;
  onCancelComment: () => void;
  onSubmitRequest: () => void;
}

const EstimateActions: React.FC<EstimateActionsProps> = ({
  status,
  userType,
  onApprove,
  onRequestChanges,
  onMarkApproved,
  onRevise,
  onDelete,
  isDeleting,
  showCommentBox,
  commentText,
  onCommentChange,
  onCancelComment,
  onSubmitRequest,
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      {userType === 'contractor' ? (
        <div className="flex justify-between">
          {onDelete && (
            <DeleteConfirmDialog
              title="Delete Estimate"
              description="Are you sure you want to delete this estimate? This action cannot be undone and will remove all related data."
              onDelete={onDelete}
              isDeleting={isDeleting}
              buttonLabel="Delete Estimate"
              variant="outline"
            />
          )}

          <div className="flex space-x-4 ml-auto">
            {status === 'drafting' && (
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Send className="mr-2 h-4 w-4" />
                Submit to Customer
              </Button>
            )}
            {status === 'submitted' && (
              <Button 
                onClick={onMarkApproved}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Approved
              </Button>
            )}
            {status !== 'drafting' && (
              <Button 
                onClick={onRevise}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Revise Estimate
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && !showCommentBox && (
            <>
              <Button 
                onClick={onRequestChanges}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                Request Changes
              </Button>
              <Button 
                onClick={onApprove}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Estimate
              </Button>
            </>
          )}
        </div>
      )}
      
      {showCommentBox && (
        <div className="mt-4">
          <label htmlFor="change-request" className="block text-sm font-medium text-gray-700 mb-2">
            Please explain what changes you need:
          </label>
          <textarea
            id="change-request"
            rows={3}
            className="shadow-sm focus:ring-amber-500 focus:border-amber-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Describe the changes you're requesting..."
          ></textarea>
          <div className="mt-2 flex justify-end space-x-2">
            <Button 
              onClick={onCancelComment}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSubmitRequest}
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={!commentText.trim()}
            >
              Submit Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateActions;
