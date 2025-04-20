
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

const mockContracts = [
  {
    id: 'CON-001',
    customer: 'John Smith',
    date: '2025-04-15',
    value: 2500.00,
    status: 'submitted' as const,
  },
  {
    id: 'CON-002',
    customer: 'Sarah Johnson',
    date: '2025-04-14',
    value: 1800.00,
    status: 'approved' as const,
  },
  {
    id: 'CON-003',
    customer: 'Mike Brown',
    date: '2025-04-13',
    value: 3200.00,
    status: 'drafting' as const,
  },
];

const ContractsList = () => {
  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contracts</h1>
          <Button asChild>
            <Link to="/contracts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Contract
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
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.id}</TableCell>
                  <TableCell>{contract.customer}</TableCell>
                  <TableCell>{contract.date}</TableCell>
                  <TableCell>${contract.value.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={contract.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/contracts/${contract.id}`}>View</Link>
                      </Button>
                      <DownloadPdfButton documentType="contract" documentId={contract.id} />
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

export default ContractsList;
