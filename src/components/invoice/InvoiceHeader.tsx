
import React from 'react';
import StatusBadge, { Status } from '../shared/StatusBadge';
import DownloadPdfButton from '../shared/DownloadPdfButton';

interface InvoiceHeaderProps {
  id: string;
  jobId: string;
  date: string;
  dueDate: string;
  status: Status;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  id,
  jobId,
  date,
  dueDate,
  status
}) => {
  return (
    <div className="px-6 pt-6 pb-3 border-b">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice #{id}</h1>
          <p className="text-sm text-gray-500">
            Job #{jobId} | Date: {date} | Due: {dueDate}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={status} />
          <DownloadPdfButton documentType="invoice" documentId={id} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
