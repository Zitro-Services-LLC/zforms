
import React from 'react';

interface DownloadPdfButtonProps {
  documentType: 'estimate' | 'contract' | 'invoice';
  documentId: string;
  compact?: boolean;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ documentType, documentId, compact = false }) => {
  // In a real app, this would trigger an API call to generate and download the PDF
  const handleDownload = () => {
    console.log(`Downloading ${documentType} ${documentId} as PDF`);
    // This would trigger a toast notification in a real application
    alert(`Downloading ${documentType} ${documentId} as PDF`);
  };

  if (compact) {
    return (
      <button
        onClick={handleDownload}
        className="p-1 text-gray-500 hover:text-amber-600"
        title={`Download ${documentType} as PDF`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Download PDF
    </button>
  );
};

export default DownloadPdfButton;
