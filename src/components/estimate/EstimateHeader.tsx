
import React from 'react';
import StatusBadge, { Status } from '../shared/StatusBadge';
import DownloadPdfButton from '../shared/DownloadPdfButton';

interface EstimateHeaderProps {
  id: string;
  jobId: string;
  status: Status;
  date: string;
}

const EstimateHeader: React.FC<EstimateHeaderProps> = ({ id, jobId, status, date }) => {
  return (
    <div className="px-6 pt-6 pb-3 border-b">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimate #{id}</h1>
          <p className="text-sm text-gray-500">Job #{jobId} | Date: {date}</p>
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={status} />
          <DownloadPdfButton documentType="estimate" documentId={id} />
        </div>
      </div>
    </div>
  );
};

export default EstimateHeader;
