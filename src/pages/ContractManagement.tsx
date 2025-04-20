import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import ContractHeader from '../components/contract/ContractHeader';
import ContractPartyInfo from '../components/contract/ContractPartyInfo';
import ContractSections from '../components/contract/ContractSections';
import ContractActions from '../components/contract/ContractActions';

// Mock data for the contract
const contractData = {
  id: 'C-101',
  jobId: 'JOB-00123',
  status: 'submitted' as Status,
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
  const [status, setStatus] = useState<Status>(contractData.status);
  
  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ContractHeader
            id={contractData.id}
            jobId={contractData.jobId}
            status={status}
            date={contractData.date}
          />
          
          <ContractPartyInfo
            contractor={contractData.contractor}
            customer={contractData.customer}
          />
          
          <ContractSections sections={contractData.sections} />

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

          <ContractActions
            userType={userType}
            status={status}
            onStatusChange={setStatus}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractManagement;
