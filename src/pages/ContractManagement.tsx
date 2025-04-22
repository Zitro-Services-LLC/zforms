import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../components/layouts/AppLayout';
import { Status } from '../components/shared/StatusBadge';
import ContractHeader from '../components/contract/ContractHeader';
import ContractPartyInfo from '../components/contract/ContractPartyInfo';
import ContractSections from '../components/contract/ContractSections';
import ContractTotal from '../components/contract/ContractTotal';
import ContractSignatures from '../components/contract/ContractSignatures';
import ContractActions from '../components/contract/ContractActions';
import CustomerSelection from '../components/shared/CustomerSelection';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { getContractById } from '@/services/contractService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Mock data for contract sections and company info
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

const contractorInfo = {
  name: 'Professional Renovations LLC',
  address: '123 Builder St, Construction City, CC 12345',
  phone: '(555) 123-4567',
  email: 'contact@professionalrenovations.com'
};

interface ContractManagementProps {
  userType?: 'contractor' | 'customer';
}

const ContractManagement: React.FC<ContractManagementProps> = ({ userType = 'contractor' }) => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  // Fetch the contract data
  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContractById(id!, user?.id),
    enabled: !!id && !!user?.id,
  });

  const [status, setStatus] = useState<Status>(contract?.status as Status || 'drafting');
  const [customer, setCustomer] = useState<any>(null);
  
  // Update status and customer when contract data is loaded
  React.useEffect(() => {
    if (contract) {
      setStatus(contract.status as Status);
      if (contract.customer) {
        setCustomer({
          name: `${contract.customer.first_name} ${contract.customer.last_name}`,
          address: contract.customer.billing_address || 'Address not provided',
          phone: contract.customer.phone || 'Phone not provided',
          email: contract.customer.email || 'Email not provided'
        });
      }
    }
  }, [contract]);
  
  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Contract status changed to ${newStatus}.`,
    });
  };
  
  const handleSelectCustomer = (selectedCustomer: any) => {
    if (selectedCustomer) {
      setCustomer({
        name: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
        address: selectedCustomer.billing_address || 'Address not provided',
        phone: selectedCustomer.phone || 'Phone not provided',
        email: selectedCustomer.email
      });
      toast({
        title: "Customer Selected",
        description: `Selected ${selectedCustomer.first_name} ${selectedCustomer.last_name} for this contract.`,
      });
    }
  };
  
  const handleAddNewCustomer = (customerData: any) => {
    setCustomer({
      name: `${customerData.first_name} ${customerData.last_name}`,
      address: customerData.billing_address || 'Address not provided',
      phone: customerData.phone || 'Phone not provided',
      email: customerData.email
    });
    toast({
      title: "New Customer Added",
      description: `Added ${customerData.first_name} ${customerData.last_name} as a new customer.`,
    });
  };
  
  // Company logo placeholder - in a real app, this would come from the user's profile
  const companyLogo = null; // Replace with actual logo URL when available
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <AppLayout userType={userType}>
        <div className="container mx-auto max-w-4xl py-20 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        </div>
      </AppLayout>
    );
  }

  // Show error state
  if (isError || !contract) {
    return (
      <AppLayout userType={userType}>
        <div className="container mx-auto max-w-4xl py-20">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error Loading Contract</h2>
            <p>Unable to load contract details. Please try again later.</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
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
          
          {/* Only show CustomerSelection when in drafting mode and no customer selected */}
          {userType === 'contractor' && status === 'drafting' && !customer && (
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">CUSTOMER INFORMATION</h3>
              <CustomerSelection 
                onSelectCustomer={handleSelectCustomer}
                onAddNewCustomer={handleAddNewCustomer}
              />
            </div>
          )}
          
          <ContractPartyInfo
            contractor={contractorInfo}
            customer={customer || {
              name: 'Customer information not available',
              address: '',
              phone: '',
              email: ''
            }}
          />
          
          <ContractSections sections={contractSections} />
          
          <ContractTotal total={contract.total_amount} />
          
          <ContractSignatures
            status={status}
            contractorName={contractorInfo.name}
            customerName={customer?.name || 'Customer'}
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
