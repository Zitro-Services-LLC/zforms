
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import EstimateHeader from '../components/estimate/EstimateHeader';
import EstimateContent from '../components/estimate/EstimateContent';
import EstimateActions from '../components/estimate/EstimateActions';
import EstimateLoadingState from '../components/estimate/EstimateLoadingState';
import EstimateErrorState from '../components/estimate/EstimateErrorState';
import CustomerSelection from '../components/shared/CustomerSelection';
import ChangeRequestModal from '../components/shared/ChangeRequestModal';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useEstimateData } from '@/hooks/estimate/useEstimateData';
import { useEstimateActivities } from '@/hooks/estimate/useEstimateActivities';
import { useEstimateActions } from '@/hooks/estimate/useEstimateActions';
import { useCustomerSelection } from '@/hooks/estimate/useCustomerSelection';
import { Status } from '@/components/shared/StatusBadge';
import { deleteEstimate } from '@/services/estimate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface EstimateManagementProps {
  userType?: 'contractor' | 'customer';
}

const EstimateManagement: React.FC<EstimateManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use custom hooks to manage state and data
  const { estimate, loading, error, images } = useEstimateData(id);
  const { activities, loadingActivities } = useEstimateActivities(id, user?.id);
  
  // Initialize customer selection with the estimate's customer if available
  const { customer, handleSelectCustomer, handleAddNewCustomer } = useCustomerSelection(
    estimate ? estimate.customer : null
  );
  
  // Initialize actions with the estimate's status if available
  const { 
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
  } = useEstimateActions(
    id, 
    user?.id, 
    (estimate?.status as Status) || 'submitted' as Status
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEstimate,
    onSuccess: () => {
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted.",
      });
      navigate('/estimates');
    },
    onError: (error) => {
      toast({
        title: "Error deleting estimate",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const handleDeleteEstimate = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout userType={userType}>
        <EstimateLoadingState />
      </AppLayout>
    );
  }

  // Error state
  if (error || !estimate) {
    return (
      <AppLayout userType={userType}>
        <EstimateErrorState error={error} />
      </AppLayout>
    );
  }

  // Company logo placeholder - in a real app, this would come from the user's profile
  const companyLogo = null; // Replace with actual logo URL when available

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <EstimateHeader
            id={estimate.id}
            jobId={estimate.jobId || ''}
            status={status}
            date={estimate.date}
            companyLogo={companyLogo}
          />
          
          {userType === 'contractor' && (
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">CUSTOMER INFORMATION</h3>
              <CustomerSelection 
                onSelectCustomer={handleSelectCustomer}
                onAddNewCustomer={handleAddNewCustomer}
              />
            </div>
          )}
          
          <EstimateContent 
            estimate={estimate}
            customer={customer}
            status={status}
            activities={activities}
            loadingActivities={loadingActivities}
          />

          <EstimateActions
            status={status}
            userType={userType}
            onApprove={handleApproveEstimate}
            onRequestChanges={() => setShowChangeRequestModal(true)}
            onMarkApproved={handleMarkApproved}
            onRevise={handleReviseEstimate}
            onDelete={handleDeleteEstimate}
            isDeleting={deleteMutation.isPending}
            showCommentBox={showCommentBox}
            commentText={commentText}
            onCommentChange={(text) => setCommentText(text)}
            onCancelComment={() => setShowCommentBox(false)}
            onSubmitRequest={() => handleRequestChanges(commentText)}
          />
          
          <ChangeRequestModal
            isOpen={showChangeRequestModal}
            onClose={() => setShowChangeRequestModal(false)}
            onSubmit={handleRequestChanges}
            documentType="estimate"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EstimateManagement;
