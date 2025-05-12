
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useEstimateActivities } from './useEstimateActivities';

export function useEstimateActions(id: string | undefined, userId: string | undefined, initialStatus: string) {
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  
  const { trackActivity } = useEstimateActivities(id, userId);

  const handleApproveEstimate = () => {
    setStatus('approved');
    trackActivity('status_changed', {
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
    
    trackActivity('requested_changes', {
      comment: comments
    });
    
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor.",
    });
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    
    trackActivity('status_changed', {
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
    
    trackActivity('status_changed', {
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
