
import React from 'react';
import { Status } from '../shared/StatusBadge';

interface EstimateActionsProps {
  status: Status;
  userType: 'contractor' | 'customer';
  onApprove: () => void;
  onRequestChanges: () => void;
  onMarkApproved: () => void;
  onRevise: () => void;
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
  showCommentBox,
  commentText,
  onCommentChange,
  onCancelComment,
  onSubmitRequest,
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
              onClick={onMarkApproved}
              className="btn-amber"
            >
              Mark as Approved
            </button>
          )}
          {status !== 'drafting' && (
            <button 
              onClick={onRevise}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Revise Estimate
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && !showCommentBox && (
            <>
              <button 
                onClick={onRequestChanges}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Request Changes
              </button>
              <button 
                onClick={onApprove}
                className="btn-amber"
              >
                Approve Estimate
              </button>
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
            <button 
              onClick={onCancelComment}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={onSubmitRequest}
              className="btn-amber"
              disabled={!commentText.trim()}
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateActions;
