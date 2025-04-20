import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import EstimateHeader from '../components/estimate/EstimateHeader';
import EstimatePartyInfo from '../components/estimate/EstimatePartyInfo';
import EstimateLineItems from '../components/estimate/EstimateLineItems';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimateActions from '../components/estimate/EstimateActions';

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
  const [status, setStatus] = useState<Status>(estimateData.status);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const handleApproveEstimate = () => {
    setStatus('approved');
    console.log(`Estimate ${id} approved`);
    // In a real app, this would send an API request
  };

  const handleRequestChanges = () => {
    if (commentText.trim()) {
      setStatus('needs-update');
      console.log(`Changes requested for estimate ${id}: ${commentText}`);
      setShowCommentBox(false);
      setCommentText('');
      // In a real app, this would send an API request
    }
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    console.log(`Marked estimate ${id} as approved`);
    // In a real app, this would send an API request
  };

  const handleReviseEstimate = () => {
    setStatus('drafting');
    console.log(`Estimate ${id} revision started`);
    // In a real app, this would navigate to an edit interface
  };

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <EstimateHeader
            id={estimateData.id}
            jobId={estimateData.jobId}
            status={status}
            date={estimateData.date}
          />
          
          <EstimatePartyInfo
            contractor={estimateData.contractor}
            customer={estimateData.customer}
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
                    <span className="text-gray-400 italic">Electronically signed by Alice Smith</span>
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
            onRequestChanges={() => setShowCommentBox(true)}
            onMarkApproved={handleMarkApproved}
            onRevise={handleReviseEstimate}
            showCommentBox={showCommentBox}
            commentText={commentText}
            onCommentChange={(text) => setCommentText(text)}
            onCancelComment={() => setShowCommentBox(false)}
            onSubmitRequest={handleRequestChanges}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EstimateManagement;
