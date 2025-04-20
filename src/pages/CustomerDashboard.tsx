
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StatusBadge from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

// Mock data for the customer dashboard
const documents = [
  {
    id: 'DOC-001',
    jobId: 'JOB-00123',
    contractor: 'Bob\'s Construction',
    type: 'Estimate',
    documentId: 'E-101',
    status: 'approved' as const,
    date: '2023-04-10'
  },
  {
    id: 'DOC-002',
    jobId: 'JOB-00123',
    contractor: 'Bob\'s Construction',
    type: 'Contract',
    documentId: 'C-101',
    status: 'approved' as const,
    date: '2023-04-15'
  },
  {
    id: 'DOC-003',
    jobId: 'JOB-00123',
    contractor: 'Bob\'s Construction',
    type: 'Invoice',
    documentId: 'I-101',
    status: 'submitted' as const,
    date: '2023-04-20'
  },
  {
    id: 'DOC-004',
    jobId: 'JOB-00124',
    contractor: 'Smith Plumbing',
    type: 'Estimate',
    documentId: 'E-201',
    status: 'submitted' as const,
    date: '2023-04-18'
  }
];

const CustomerDashboard = () => {
  return (
    <AppLayout userType="customer">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Documents</h1>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Received
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.jobId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.contractor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{doc.documentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/${doc.type.toLowerCase()}s/${doc.documentId}`} 
                          className="text-amber-600 hover:text-amber-900"
                        >
                          {doc.status === 'submitted' ? 'Review & Approve' : 'View'}
                        </Link>
                        <DownloadPdfButton 
                          documentType={doc.type.toLowerCase() as 'estimate' | 'contract' | 'invoice'} 
                          documentId={doc.documentId}
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerDashboard;
