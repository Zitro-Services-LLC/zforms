
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
import { useQuery } from '@tanstack/react-query';
import { getEstimates } from '@/services/estimateService';

const EstimatesList = () => {
  const { data: estimates = [], isLoading, isError } = useQuery({
    queryKey: ['estimates'],
    queryFn: getEstimates,
  });

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
          {isLoading ? (
            <div className="py-8 text-center">Loading estimates...</div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500">Failed to load estimates.</div>
          ) : estimates.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No estimates found. Click <b>New Estimate</b> to create your first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell>{estimate.id}</TableCell>
                    <TableCell>{estimate.customer_id}</TableCell>
                    <TableCell>{estimate.date}</TableCell>
                    <TableCell>${Number(estimate.total).toFixed(2)}</TableCell>
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
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default EstimatesList;
