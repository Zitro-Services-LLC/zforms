import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StatusBadge, { Status } from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

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
          {/* Document Header */}
          <div className="px-6 pt-6 pb-3 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estimate #{estimateData.id}</h1>
                <p className="text-sm text-gray-500">Job #{estimateData.jobId} | Date: {estimateData.date}</p>
              </div>
              <div className="flex flex-col items-end">
                <StatusBadge status={status} />
                <DownloadPdfButton documentType="estimate" documentId={estimateData.id} />
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="p-6 document-header">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{estimateData.contractor.name}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{estimateData.contractor.address}</p>
                  <p>{estimateData.contractor.phone}</p>
                  <p>{estimateData.contractor.email}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500">CUSTOMER</h2>
                <p className="text-base font-medium text-gray-900">{estimateData.customer.name}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{estimateData.customer.address}</p>
                  <p>{estimateData.customer.phone}</p>
                  <p>{estimateData.customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="px-6 document-section">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">JOB DESCRIPTION</h2>
            <p className="text-base text-gray-900 whitespace-pre-line">{estimateData.description}</p>
          </div>

          {/* Line Items */}
          <div className="px-6 document-section overflow-x-auto">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">LINE ITEMS</h2>
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {estimateData.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity.toLocaleString()}</td>
                    <td className="text-right">${item.rate.toLocaleString()}</td>
                    <td className="text-right">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-6 document-section">
            <div className="flex flex-col items-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${estimateData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900 font-medium">${estimateData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                  <span>Total</span>
                  <span>${estimateData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Area (simplified) */}
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

          {/* Action Buttons */}
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
                    onClick={handleMarkApproved}
                    className="btn-amber"
                  >
                    Mark as Approved
                  </button>
                )}
                {status !== 'drafting' && (
                  <button 
                    onClick={handleReviseEstimate}
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
                      onClick={() => setShowCommentBox(true)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Request Changes
                    </button>
                    <button 
                      onClick={handleApproveEstimate}
                      className="btn-amber"
                    >
                      Approve Estimate
                    </button>
                  </>
                )}
              </div>
            )}
            
            {/* Change Request Form */}
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
        </div>
      </div>
    </AppLayout>
  );
};

export default EstimateManagement;
