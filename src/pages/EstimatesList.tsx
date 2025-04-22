
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
import StatusBadge, { Status } from '../components/shared/StatusBadge';
import DownloadPdfButton from '../components/shared/DownloadPdfButton';
import { useQuery } from '@tanstack/react-query';
import { getEstimates } from '@/services/estimateService';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const EstimatesList = () => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  const { data: estimates = [], isLoading, isError } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => getEstimates(user?.id),
    enabled: !!user,
  });

  // Helper function to map database status to StatusBadge status type
  const mapStatusToType = (status: string): Status => {
    switch(status) {
      case 'draft':
        return 'drafting';
      case 'submitted':
        return 'submitted';
      case 'approved':
        return 'approved';
      case 'needs-update':
        return 'needs-update';
      case 'paid':
        return 'paid';
      default:
        return 'drafting'; // Default fallback
    }
  };

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading estimates",
        description: "There was a problem loading your estimates. Please try again later.",
        variant: "destructive"
      });
    }
  }, [isError, toast]);

  // Log data for debugging
  React.useEffect(() => {
    console.log('Estimates data:', estimates);
  }, [estimates]);

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
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell>{estimate.id.slice(0, 8)}...</TableCell>
                    <TableCell>{estimate.title}</TableCell>
                    <TableCell>{estimate.customer_id}</TableCell>
                    <TableCell>{new Date(estimate.date).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(estimate.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={mapStatusToType(estimate.status)} />
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
