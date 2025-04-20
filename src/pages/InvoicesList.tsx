
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

const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'John Smith',
    date: '2025-04-15',
    amount: 2500.00,
    status: 'submitted' as const,
  },
  {
    id: 'INV-002',
    customer: 'Sarah Johnson',
    date: '2025-04-14',
    amount: 1800.00,
    status: 'paid' as const,
  },
  {
    id: 'INV-003',
    customer: 'Mike Brown',
    date: '2025-04-13',
    amount: 3200.00,
    status: 'drafting' as const,
  },
];

const InvoicesList = () => {
  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button asChild>
            <Link to="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
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
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/${invoice.id}`}>View</Link>
                      </Button>
                      <DownloadPdfButton documentType="invoice" documentId={invoice.id} />
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

export default InvoicesList;
