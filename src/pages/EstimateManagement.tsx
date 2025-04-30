
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import EstimateHeader from '../components/estimate/EstimateHeader';
import EstimatePartyInfo from '../components/estimate/EstimatePartyInfo';
import EstimateLineItems from '../components/estimate/EstimateLineItems';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimateActions from '../components/estimate/EstimateActions';
import CustomerSelection from '../components/shared/CustomerSelection';
import ChangeRequestModal from '../components/shared/ChangeRequestModal';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  getEstimateActivities, 
  trackEstimateActivity, 
  trackEstimateView, 
  getEstimateById, 
  getEstimateItems,
  getEstimateImages
} from '@/services/estimateService';
import EstimateActivities from '@/components/estimate/EstimateActivities';
import { EstimateData, EstimateWithCustomerAndItems } from '@/types/estimate';
import { EstimateImage } from '@/types/database';

interface EstimateManagementProps {
  userType?: 'contractor' | 'customer';
}

const EstimateManagement: React.FC<EstimateManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [status, setStatus] = useState<Status>('submitted');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [images, setImages] = useState<EstimateImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load estimate details
  useEffect(() => {
    if (!id || !user) return;
    
    setLoading(true);
    setError(null);
    
    // Track this view
    trackEstimateView(id, user.id).catch(error => {
      console.error("Error tracking estimate view:", error);
    });
    
    // Load estimate data
    const fetchEstimateData = async () => {
      try {
        const estimateData = await getEstimateById(id);
        const items = await getEstimateItems(id);
        const estimateImages = await getEstimateImages(id);
        
        // Transform the data into the view model expected by components
        const viewModel: EstimateData = {
          id: estimateData.id,
          jobId: estimateData.job_number || undefined,
          status: estimateData.status as Status,
          date: estimateData.date,
          contractor: {
            name: estimateData.contractor?.company_name || 'Unknown Company',
            address: estimateData.contractor?.company_address || 'No address provided',
            phone: estimateData.contractor?.company_phone || 'No phone provided',
            email: estimateData.contractor?.company_email || 'No email provided',
          },
          customer: {
            name: estimateData.customer ? 
              `${estimateData.customer.first_name} ${estimateData.customer.last_name}` : 
              'Unknown Customer',
            address: estimateData.customer?.billing_address || 'No address provided',
            phone: estimateData.customer?.phone || 'No phone provided',
            email: estimateData.customer?.email || 'No email provided',
          },
          description: estimateData.job_description || '',
          lineItems: items,
          subtotal: Number(estimateData.subtotal),
          tax: Number(estimateData.tax_amount || 0),
          total: Number(estimateData.total),
          notes: estimateData.notes || '',
          jobNumber: estimateData.job_number || undefined,
          jobDescription: estimateData.job_description || undefined
        };
        
        setEstimate(viewModel);
        setStatus(viewModel.status as Status);
        setCustomer(viewModel.customer);
        setImages(estimateImages);
        
      } catch (error) {
        console.error("Error loading estimate data:", error);
        setError("Failed to load estimate data. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load estimate data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstimateData();
  }, [id, user, toast]);

  // Load activities history
  useEffect(() => {
    if (id && user) {
      setLoadingActivities(true);
      
      getEstimateActivities(id)
        .then(data => {
          setActivities(data);
        })
        .catch(error => {
          console.error("Error loading estimate activities:", error);
          toast({
            title: "Error",
            description: "Could not load estimate activity history.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setLoadingActivities(false);
        });
    }
  }, [id, user, toast]);
  
  const handleApproveEstimate = () => {
    setStatus('approved');
    if (id && user) {
      trackEstimateActivity(id, user.id, 'status_changed', {
        status: 'approved',
        previous_status: status
      });
    }
    toast({
      title: "Estimate Approved",
      description: `Estimate #${id} has been approved.`,
    });
  };

  const handleRequestChanges = (comments: string) => {
    setStatus('needs-update');
    setCommentText(comments);
    setShowChangeRequestModal(false);
    
    if (id && user) {
      trackEstimateActivity(id, user.id, 'requested_changes', {
        comment: comments
      });
    }
    
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor.",
    });
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    
    if (id && user) {
      trackEstimateActivity(id, user.id, 'status_changed', {
        status: 'approved',
        previous_status: status,
        manually_set: true
      });
    }
    
    toast({
      title: "Status Updated",
      description: `Estimate #${id} status updated to Approved.`,
    });
  };

  const handleReviseEstimate = () => {
    setStatus('drafting');
    
    if (id && user) {
      trackEstimateActivity(id, user.id, 'status_changed', {
        status: 'drafting',
        previous_status: status
      });
    }
    
    toast({
      title: "Revision Started",
      description: `Estimate #${id} revision has been started.`,
    });
  };
  
  const handleSelectCustomer = (selectedCustomer: any) => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.name} for this estimate.`,
      });
    }
  };
  
  const handleAddNewCustomer = (customerData: any) => {
    setCustomer({
      ...customerData,
      id: `CUST-${Math.floor(Math.random() * 1000)}`
    });
    toast({
      title: "New Customer Added",
      description: `Added ${customerData.name} as a new customer.`,
    });
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout userType={userType}>
        <div className="container mx-auto p-6 flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading estimate data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error || !estimate) {
    return (
      <AppLayout userType={userType}>
        <div className="container mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm leading-5 text-red-700">
                  {error || "Estimate not found or cannot be loaded."}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
          >
            Go Back
          </button>
        </div>
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
            status={status as Status}
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
          
          <Tabs defaultValue="details" className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Estimate Details</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <EstimatePartyInfo
                contractor={estimate.contractor}
                customer={estimate.customer}
              />

              <div className="px-2 document-section">
                <h2 className="text-sm font-semibold text-gray-500 mb-2">JOB DESCRIPTION</h2>
                <p className="text-base text-gray-900 whitespace-pre-line">{estimate.description}</p>
              </div>

              <EstimateLineItems items={estimate.lineItems} />
              
              <EstimateTotals
                subtotal={estimate.subtotal}
                tax={estimate.tax}
                total={estimate.total}
              />

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">CONTRACTOR SIGNATURE</h3>
                    <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 italic">Electronically signed by Bob Builder</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">CUSTOMER SIGNATURE</h3>
                    <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                      {status === 'approved' ? (
                        <span className="text-gray-400 italic">Electronically signed by {customer.name}</span>
                      ) : (
                        <span className="text-gray-400 italic">Awaiting signature</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="bg-white rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
                
                <Separator className="my-4" />
                
                {loadingActivities ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>Loading activity history...</p>
                  </div>
                ) : (
                  <EstimateActivities activities={activities} />
                )}
              </div>
            </TabsContent>
          </Tabs>

          <EstimateActions
            status={status}
            userType={userType}
            onApprove={handleApproveEstimate}
            onRequestChanges={() => setShowChangeRequestModal(true)}
            onMarkApproved={handleMarkApproved}
            onRevise={handleReviseEstimate}
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
