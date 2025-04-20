
import React, { useState } from 'react';
import { Status } from '../shared/StatusBadge';
import ChangeRequestModal from '../shared/ChangeRequestModal';

interface ContractActionsProps {
  userType: 'contractor' | 'customer';
  status: Status;
  onStatusChange: (newStatus: Status) => void;
  onRequestChanges?: () => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({ 
  userType, 
  status, 
  onStatusChange,
  onRequestChanges 
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleApproveContract = () => {
    onStatusChange('approved');
  };

  const handleRequestChanges = () => {
    if (commentText.trim()) {
      onStatusChange('needs-update');
      setShowCommentBox(false);
      setCommentText('');
    }
  };

  const handleReviseContract = () => {
    onStatusChange('drafting');
  };

  const handleRequestChangesClick = () => {
    if (onRequestChanges) {
      onRequestChanges();
    } else {
      setShowCommentBox(true);
    }
  };

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
              onClick={() => onStatusChange('approved')}
              className="btn-amber"
            >
              Mark as Approved
            </button>
          )}
          {status !== 'drafting' && (
            <button 
              onClick={handleReviseContract}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Revise Contract
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-end space-x-4">
          {status === 'submitted' && !showCommentBox && (
            <>
              <button 
                onClick={handleRequestChangesClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Request Changes
              </button>
              <button 
                onClick={handleApproveContract}
                className="btn-amber"
              >
                Approve Contract
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
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Describe the changes you're requesting..."
          ></textarea>
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              onClick={() => setShowCommentBox(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleRequestChanges}
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

export default ContractActions;
