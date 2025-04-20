
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import ContractHeader from '../components/contract/ContractHeader';
import ContractPartyInfo from '../components/contract/ContractPartyInfo';
import ContractSections from '../components/contract/ContractSections';
import ContractTotal from '../components/contract/ContractTotal';
import ContractSignatures from '../components/contract/ContractSignatures';
import ContractActions from '../components/contract/ContractActions';
import CustomerSelection from '../components/shared/CustomerSelection';
import ChangeRequestModal from '../components/shared/ChangeRequestModal';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(contractData.status);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [customer, setCustomer] = useState(contractData.customer);
  
  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Contract #${id} status changed to ${newStatus}.`,
    });
  };
  
  const handleRequestChanges = (comments: string) => {
    setStatus('needs-update');
    setShowChangeRequestModal(false);
    toast({
      title: "Changes Requested",
      description: "Your change request has been submitted to the contractor.",
    });
  };
  
  const handleSelectCustomer = (selectedCustomer: any) => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.name} for this contract.`,
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
          <ContractHeader
            id={contractData.id}
            jobId={contractData.jobId}
            status={status}
            date={contractData.date}
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
          
          <ContractPartyInfo
            contractor={contractData.contractor}
            customer={customer}
          />
          
          <ContractSections sections={contractData.sections} />

          <ContractTotal total={contractData.total} />

          <ContractSignatures
            status={status}
            contractorName={contractData.contractor.name}
            customerName={customer.name}
            date={contractData.date}
          />

          <ContractActions
            userType={userType}
            status={status}
            onStatusChange={handleStatusChange}
            onRequestChanges={() => setShowChangeRequestModal(true)}
          />
          
          <ChangeRequestModal
            isOpen={showChangeRequestModal}
            onClose={() => setShowChangeRequestModal(false)}
            onSubmit={handleRequestChanges}
            documentType="contract"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractManagement;
