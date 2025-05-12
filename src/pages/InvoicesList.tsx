
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
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
import DeleteConfirmDialog from '../components/shared/DeleteConfirmDialog';
import { useInvoices } from '@/hooks/useInvoices';
import { deleteInvoice } from '@/services/invoice/invoiceMutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const InvoicesList = () => {
  const { invoicesQuery } = useInvoices();
  const { data: invoices, isLoading, error } = invoicesQuery;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting invoice",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

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
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="animate-spin h-6 w-6 text-amber-500 mr-2" />
              <span>Loading invoices...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading invoices: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : invoices?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoice_number}</TableCell>
                    <TableCell>
                      {invoice.customer ? 
                        `${invoice.customer.first_name} ${invoice.customer.last_name}` : 
                        'No customer'
                      }
                    </TableCell>
                    <TableCell>
                      {invoice.issue_date ? format(new Date(invoice.issue_date), 'yyyy-MM-dd') : '-'}
                    </TableCell>
                    <TableCell>${Number(invoice.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/invoices/${invoice.id}`}>View</Link>
                        </Button>
                        <DownloadPdfButton documentType="invoice" documentId={invoice.id} />
                        <DeleteConfirmDialog
                          title="Delete Invoice"
                          description={`Are you sure you want to delete this invoice for ${invoice.customer ? `${invoice.customer.first_name} ${invoice.customer.last_name}` : 'unknown customer'}?`}
                          onDelete={() => deleteMutation.mutate(invoice.id)}
                          isDeleting={deleteMutation.isPending && deleteMutation.variables === invoice.id}
                          variant="outline"
                          size="sm"
                          buttonLabel=""
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No invoices found. Click "New Invoice" to create one.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default InvoicesList;
