
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StatusBadge from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

// Mock data for the contract
const contractData = {
  id: 'C-101',
  jobId: 'JOB-00123',
  status: 'submitted' as const,
  date: '2023-04-15',
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
  // Mock contract sections
  sections: [
    {
      id: 1,
      title: 'Scope of Work',
      content: `Bob's Construction will provide all materials and perform all work for the complete kitchen renovation at the customer's address. The work includes:
      
1. Removal of all existing cabinets, countertops, and flooring
2. Installation of new custom cherry cabinets as per approved design
3. Installation of granite countertops 
4. Installation of luxury vinyl tile flooring
5. Connection of all plumbing fixtures and appliances
      
Any changes to this scope of work must be agreed upon in writing by both parties before work commences.`
    },
    {
      id: 2,
      title: 'Payment Schedule',
      content: `The total contract amount is $17,577.00, to be paid according to the following schedule:

1. 25% ($4,394.25) due upon signing of this contract
2. 50% ($8,788.50) due upon delivery of materials and commencement of work
3. 25% ($4,394.25) due upon completion of all work and final inspection
      
Payments can be made by check, credit card, or bank transfer. Late payments are subject to a 1.5% monthly finance charge.`
    },
    {
      id: 3,
      title: 'Timeline',
      content: `Work is estimated to be completed within 3-4 weeks from the start date, subject to material availability and unforeseen conditions. The estimated timeline is:

- Week 1: Demolition and preparation
- Week 2: Cabinet and countertop installation
- Week 3: Flooring installation
- Week 4: Finishing work and cleanup

Bob's Construction will make every effort to complete the work according to this schedule but is not responsible for delays due to material shortages, weather, or other circumstances beyond our control.`
    },
    {
      id: 4,
      title: 'Warranties and Guarantees',
      content: `Bob's Construction warrants all workmanship for a period of one year from completion. All materials are covered by manufacturers' warranties. This warranty does not cover damage due to normal wear and tear, improper maintenance, or alterations made by others.`
    }
  ],
  total: 17577
};

interface ContractManagementProps {
  userType?: 'contractor' | 'customer';
}

const ContractManagement: React.FC<ContractManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState(contractData.status);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const handleApproveContract = () => {
    setStatus('approved');
    console.log(`Contract ${id} approved`);
  };

  const handleRequestChanges = () => {
    if (commentText.trim()) {
      setStatus('needs-update');
      console.log(`Changes requested for contract ${id}: ${commentText}`);
      setShowCommentBox(false);
      setCommentText('');
    }
  };

  const handleMarkApproved = () => {
    setStatus('approved');
    console.log(`Marked contract ${id} as approved`);
  };

  const handleReviseContract = () => {
    setStatus('drafting');
    console.log(`Contract ${id} revision started`);
  };

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Header */}
          <div className="px-6 pt-6 pb-3 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contract #{contractData.id}</h1>
                <p className="text-sm text-gray-500">Job #{contractData.jobId} | Date: {contractData.date}</p>
              </div>
              <div className="flex flex-col items-end">
                <StatusBadge status={status} />
                <DownloadPdfButton documentType="contract" documentId={contractData.id} />
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="p-6 document-header">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{contractData.contractor.name}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{contractData.contractor.address}</p>
                  <p>{contractData.contractor.phone}</p>
                  <p>{contractData.contractor.email}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500">CUSTOMER</h2>
                <p className="text-base font-medium text-gray-900">{contractData.customer.name}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{contractData.customer.address}</p>
                  <p>{contractData.customer.phone}</p>
                  <p>{contractData.customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Sections */}
          <div className="px-6">
            {contractData.sections.map((section) => (
              <div key={section.id} className="document-section">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
                <div className="text-base text-gray-700 whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>

          {/* Contract Total */}
          <div className="px-6 py-4 border-t border-gray-200 mt-6">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 font-semibold text-lg">
                  <span>Total Contract Amount:</span>
                  <span>${contractData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="px-6 pt-4 pb-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">CONTRACTOR SIGNATURE</h3>
                <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 italic">Electronically signed by Bob Builder</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Date: {contractData.date}</p>
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
                {status === 'approved' && <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>}
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
                      onClick={() => setShowCommentBox(true)}
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

export default ContractManagement;
