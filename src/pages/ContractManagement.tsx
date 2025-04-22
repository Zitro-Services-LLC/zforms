
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import ContractHeader from '../components/contract/ContractHeader';
import ContractPartyInfo from '../components/contract/ContractPartyInfo';
import ContractSections from '../components/contract/ContractSections';
import ContractTotal from '../components/contract/ContractTotal';
import ContractSignatures from '../components/contract/ContractSignatures';
import ContractActions from '../components/contract/ContractActions';
import { ContractLoadingState } from '../components/contract/ContractLoadingState';
import { ContractErrorState } from '../components/contract/ContractErrorState';
import { ContractCustomerSection } from '../components/contract/ContractCustomerSection';
import { useContractData } from '@/hooks/useContractData';
import { customerToPartyInfo } from '@/utils/customerUtils';
import type { PartyInfo } from '@/utils/customerUtils';

interface ContractManagementProps {
  userType?: 'contractor' | 'customer';
}

const ContractManagement: React.FC<ContractManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const {
    contract,
    isLoading,
    isError,
    status,
    customer,
    handleStatusChange,
    setCustomer
  } = useContractData(id);

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout userType={userType}>
        <ContractLoadingState />
      </AppLayout>
    );
  }

  // Show error state
  if (isError || !contract) {
    return (
      <AppLayout userType={userType}>
        <ContractErrorState />
      </AppLayout>
    );
  }

  // Mock data for contract sections and company info (keep as is since it's sample data)
  const contractSections = [
    {
      id: 1,
      title: 'Scope of Work',
      content: `The contractor will provide all materials and perform all work for the complete renovation as outlined in the detailed specification document. The work includes:
    
1. Removal of all existing fixtures as specified
2. Installation of new custom materials as per approved design
3. Installation of all requested hardware and fixtures 
4. Connection of all plumbing fixtures and appliances
    
Any changes to this scope of work must be agreed upon in writing by both parties before work commences.`
    },
    {
      id: 2,
      title: 'Payment Schedule',
      content: `Payment will be made according to the following schedule:

1. 25% due upon signing of this contract
2. 50% due upon delivery of materials and commencement of work
3. 25% due upon completion of all work and final inspection
    
Payments can be made by check, credit card, or bank transfer. Late payments are subject to a 1.5% monthly finance charge.`
    },
    {
      id: 3,
      title: 'Timeline',
      content: `Work is estimated to be completed within 3-4 weeks from the start date, subject to material availability and unforeseen conditions. The estimated timeline is:

- Week 1: Demolition and preparation
- Week 2: Main installation work
- Week 3: Secondary installations
- Week 4: Finishing work and cleanup

The contractor will make every effort to complete the work according to this schedule but is not responsible for delays due to material shortages, weather, or other circumstances beyond our control.`
    },
    {
      id: 4,
      title: 'Warranties and Guarantees',
      content: `The contractor warrants all workmanship for a period of one year from completion. All materials are covered by manufacturers' warranties. This warranty does not cover damage due to normal wear and tear, improper maintenance, or alterations made by others.`
    }
  ];

  const contractorInfo: PartyInfo = {
    name: 'Professional Renovations LLC',
    address: '123 Builder St, Construction City, CC 12345',
    phone: '(555) 123-4567',
    email: 'contact@professionalrenovations.com'
  };

  // Convert customer to PartyInfo
  const customerInfo = customerToPartyInfo(customer);

  return (
    <AppLayout userType={userType}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ContractHeader
            id={contract.id}
            displayId={contract.display_id}
            jobId={contract.estimate_id || 'N/A'}
            status={status}
            date={contract.created_at}
            companyLogo={null}
          />
          
          {userType === 'contractor' && status === 'drafting' && !customer && (
            <ContractCustomerSection
              onSelectCustomer={setCustomer}
              onAddNewCustomer={setCustomer}
            />
          )}
          
          <ContractPartyInfo
            contractor={contractorInfo}
            customer={customerInfo}
          />
          
          <ContractSections sections={contractSections} />
          
          <ContractTotal total={contract.total_amount} />
          
          <ContractSignatures
            status={status}
            contractorName={contractorInfo.name}
            customerName={customerInfo.name}
            date={contract.created_at.substring(0, 10)}
          />
          
          <ContractActions
            userType={userType}
            status={status}
            contractId={contract.id}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractManagement;
