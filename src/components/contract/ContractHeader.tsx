
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge, { Status } from '../shared/StatusBadge';
import DownloadPdfButton from '../shared/DownloadPdfButton';
import { Building, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface ContractHeaderProps {
  id: string;
  displayId: string;
  jobId: string;
  status: Status;
  date: string;
  companyLogo?: string;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ 
  id, 
  displayId,
  jobId, 
  status, 
  date,
  companyLogo 
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formattedDate = formatDate(date);

  return (
    <div className="px-6 pt-6 pb-3 border-b">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/contracts')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center">
          <div className="w-16 h-16 mr-4 flex items-center justify-center overflow-hidden">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayId}</h1>
            <p className="text-sm text-gray-500">Job #{jobId} | Date: {formattedDate}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={status} />
          <DownloadPdfButton documentType="contract" documentId={id} />
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
