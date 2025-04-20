
import React, { useState } from 'react';
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

// Mock data for the estimate
const estimateData = {
  id: 'E-101',
  jobId: 'JOB-00123',
  status: 'submitted' as Status,
  date: '2023-04-10',
  contractor: {
    name: 'Bob\'s Construction',
    address: '123 Builder St, Construction City, CC 12345',
    phone: '(555) 123-4567',
    email: 'bob@bobconstruction.com'
  },
  customer: {
    name: 'Alice Smith',
    address: '456 Home Ave, Hometown, HT 67890',
    phone: '(555) 987-6543',
    email: 'alice@example.com'
  },
  description: 'Complete kitchen renovation including new cabinets, countertops, flooring, and appliances.',
  lineItems: [
    { id: 1, description: 'Kitchen Cabinets - Premium Cherry', quantity: 1, rate: 7500, amount: 7500 },
    { id: 2, description: 'Countertops - Granite, 45 sq ft', quantity: 45, rate: 75, amount: 3375 },
    { id: 3, description: 'Flooring - Luxury Vinyl Tile, 200 sq ft', quantity: 200, rate: 10, amount: 2000 },
    { id: 4, description: 'Labor - Installation', quantity: 40, rate: 85, amount: 3400 }
  ],
  subtotal: 16275,
  tax: 1302,
  total: 17577
};

interface EstimateManagementProps {
  userType?: 'contractor' | 'customer';
}

const EstimateManagement: React.FC<EstimateManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(estimateData.status);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [customer, setCustomer] = useState(estimateData.customer);
  
  const handleApproveEstimate = () => {
    setStatus('approved');
    toast({
      title: "Estimate Approved",
      description: `Estimate #${id} has been approved.`,
    });
  };

  const handleRequestChanges = (comments: string) => {
    setStatus('needs-update');
    setCommentText(comments);
    setShowChangeRequestModal(false);
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor.",
    });
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    toast({
      title: "Status Updated",
      description: `Estimate #${id} status updated to Approved.`,
    });
  };

  const handleReviseEstimate = () => {
    setStatus('drafting');
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

  // Company logo placeholder - in a real app, this would come from the user's profile
  const companyLogo = null; // Replace with actual logo URL when available

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <EstimateHeader
            id={estimateData.id}
            jobId={estimateData.jobId}
            status={status}
            date={estimateData.date}
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
          
          <EstimatePartyInfo
            contractor={estimateData.contractor}
            customer={customer}
          />

          <div className="px-6 document-section">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">JOB DESCRIPTION</h2>
            <p className="text-base text-gray-900 whitespace-pre-line">{estimateData.description}</p>
          </div>

          <EstimateLineItems items={estimateData.lineItems} />
          
          <EstimateTotals
            subtotal={estimateData.subtotal}
            tax={estimateData.tax}
            total={estimateData.total}
          />

          <div className="px-6 pt-4 pb-6 border-t">
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
