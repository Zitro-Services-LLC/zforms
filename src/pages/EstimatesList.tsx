
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '../components/layouts/AppLayout';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import StatusBadge from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';

const mockEstimates = [
  {
    id: 'EST-001',
    customer: 'John Smith',
    date: '2025-04-15',
    total: 2500.00,
    status: 'submitted' as const,
  },
  {
    id: 'EST-002',
    customer: 'Sarah Johnson',
    date: '2025-04-14',
    total: 1800.00,
    status: 'approved' as const,
  },
  {
    id: 'EST-003',
    customer: 'Mike Brown',
    date: '2025-04-13',
    total: 3200.00,
    status: 'drafting' as const,
  },
];

const EstimatesList = () => {
  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Estimates</h1>
          <Button asChild>
            <Link to="/estimates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Estimate
            </Link>
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEstimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.id}</TableCell>
                  <TableCell>{estimate.customer}</TableCell>
                  <TableCell>{estimate.date}</TableCell>
                  <TableCell>${estimate.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={estimate.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/estimates/${estimate.id}`}>View</Link>
                      </Button>
                      <DownloadPdfButton documentType="estimate" documentId={estimate.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default EstimatesList;
