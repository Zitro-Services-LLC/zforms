
import React from 'react';
import StatusBadge, { Status } from '../shared/StatusBadge';
import DownloadPdfButton from '../shared/DownloadPdfButton';
import { Building } from 'lucide-react';
import { useContractorData } from '@/hooks/useContractorData';

interface EstimateHeaderProps {
  id: string;
  jobId: string;
  status: Status;
  date: string;
  companyLogo?: string;
}

const EstimateHeader: React.FC<EstimateHeaderProps> = ({ 
  id, 
  jobId, 
  status, 
  date,
  companyLogo
}) => {
  // Format date to MM/DD/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formattedDate = formatDate(date);
  const { loading, contractorData } = useContractorData();

  return (
    <div className="px-6 pt-6 pb-3 border-b bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left column: Logo */}
        <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="max-h-full max-w-full object-contain" 
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
              <Building className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Middle column: Company info */}
        <div className="text-center md:text-left flex-1 px-4">
          <h1 className="text-xl font-bold text-gray-800">
            {contractorData?.companyName || "Bob's New Construction"}
          </h1>
          <div className="mt-1 text-sm text-gray-600 space-y-1">
            {contractorData?.companyAddress && (
              <p>Address: {contractorData.companyAddress}</p>
            )}
            {contractorData?.companyPhone && (
              <p>Tel: {contractorData.companyPhone}</p>
            )}
            {contractorData?.companyEmail && (
              <p>Email: {contractorData.companyEmail}</p>
            )}
          </div>
        </div>

        {/* Right column: Estimate info */}
        <div className="text-right flex flex-col items-end">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">ESTIMATE</h2>
          <div className="bg-gray-100 px-4 py-2 rounded-md w-64">
            <div className="flex justify-between mb-2">
              <span className="font-medium">DATE</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ESTIMATE #</span>
              <span>{id}</span>
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <StatusBadge status={status} />
            <DownloadPdfButton documentType="estimate" documentId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateHeader;
