
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StatusBadge from '../components/shared/StatusBadge';
import ProgressBar from '../components/shared/ProgressBar';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

// Mock data for the contractor dashboard
const jobs = [
  {
    id: 'JOB-00123',
    customer: 'Alice Smith',
    estimate: { id: 'E-101', status: 'approved' as const },
    contract: { id: 'C-101', status: 'approved' as const },
    invoice: { id: 'I-101', status: 'submitted' as const },
    progress: 66
  },
  {
    id: 'JOB-00124',
    customer: 'John Doe',
    estimate: { id: 'E-102', status: 'approved' as const },
    contract: { id: 'C-102', status: 'drafting' as const },
    invoice: { id: null, status: 'drafting' as const },
    progress: 33
  },
  {
    id: 'JOB-00125',
    customer: 'Sarah Johnson',
    estimate: { id: 'E-103', status: 'submitted' as const },
    contract: { id: null, status: 'drafting' as const },
    invoice: { id: null, status: 'drafting' as const },
    progress: 0
  }
];

const ContractorDashboard = () => {
  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Dashboard</h1>
          <Link to="/estimates/new" className="btn-amber">
            + New Estimate
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimate Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <StatusBadge status={job.estimate.status} />
                        {job.estimate.id && (
                          <DownloadPdfButton 
                            documentType="estimate" 
                            documentId={job.estimate.id} 
                            compact 
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <StatusBadge status={job.contract.status} />
                        {job.contract.id && (
                          <DownloadPdfButton 
                            documentType="contract" 
                            documentId={job.contract.id} 
                            compact 
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <StatusBadge status={job.invoice.status} />
                        {job.invoice.id && (
                          <DownloadPdfButton 
                            documentType="invoice" 
                            documentId={job.invoice.id} 
                            compact 
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <ProgressBar value={job.progress} />
                        <span className="mt-1 text-xs text-gray-500">{job.progress}% Complete</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/jobs/${job.id}`} className="text-amber-600 hover:text-amber-900">
                        View Details
                      </Link>
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

export default ContractorDashboard;
