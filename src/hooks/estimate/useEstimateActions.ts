
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useEstimateActivities } from './useEstimateActivities';
import { EstimateActionType } from '@/services/estimate/types';
import { Status } from '@/components/shared/StatusBadge';

export function useEstimateActions(id: string | undefined, userId: string | undefined, initialStatus: Status) {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  
  const { trackActivity } = useEstimateActivities(id, userId);

  const handleApproveEstimate = () => {
    setStatus('approved');
    trackActivity(EstimateActionType.STATUS_CHANGED, {
      status: 'approved',
      previous_status: status
    });
    toast({
      title: "Estimate Approved",
      description: `Estimate #${id} has been approved.`,
    });
  };

  const handleRequestChanges = (comments: string) => {
    setStatus('needs-update');
    setCommentText(comments);
    setShowChangeRequestModal(false);
    
    trackActivity(EstimateActionType.REQUESTED_CHANGES, {
      comment: comments
    });
    
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor.",
    });
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    
    trackActivity(EstimateActionType.STATUS_CHANGED, {
      status: 'approved',
      previous_status: status,
      manually_set: true
    });
    
    toast({
      title: "Status Updated",
      description: `Estimate #${id} status updated to Approved.`,
    });
  };

  const handleReviseEstimate = () => {
    setStatus('drafting');
    
    trackActivity(EstimateActionType.STATUS_CHANGED, {
      status: 'drafting',
      previous_status: status
    });
    
    toast({
      title: "Revision Started",
      description: `Estimate #${id} revision has been started.`,
    });
  };

  return {
    status,
    showCommentBox,
    commentText,
    showChangeRequestModal,
    setShowChangeRequestModal,
    setCommentText,
    setShowCommentBox,
    handleApproveEstimate,
    handleRequestChanges,
    handleMarkApproved,
    handleReviseEstimate
  };
}
