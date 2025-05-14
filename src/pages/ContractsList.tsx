
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
import { getContracts, deleteContract } from '@/services/contract';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';

const ContractsList = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  console.log('Current user:', user?.id);
  
  const { data: contracts = [], isLoading, isError } = useQuery({
    queryKey: ['contracts', user?.id],
    queryFn: () => getContracts(user?.id),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', user?.id] });
      toast({
        title: "Contract deleted",
        description: "The contract has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting contract",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  console.log('Contracts from query:', contracts);

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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500">
              Failed to load contracts. Please try again.
            </div>
          ) : contracts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No contracts found. Click <b>New Contract</b> to create your first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.title}</TableCell>
                    <TableCell>
                      {contract.customer ? 
                        `${contract.customer.first_name} ${contract.customer.last_name}` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {contract.total_amount ? 
                        `$${contract.total_amount.toFixed(2)}` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/contracts/${contract.id}`}>View</Link>
                        </Button>
                        <DownloadPdfButton documentType="contract" documentId={contract.id} />
                        <DeleteConfirmDialog
                          title="Delete Contract"
                          description={`Are you sure you want to delete this contract for ${contract.customer ? `${contract.customer.first_name} ${contract.customer.last_name}` : 'unknown customer'}?`}
                          onDelete={() => deleteMutation.mutate(contract.id)}
                          isDeleting={deleteMutation.isPending && deleteMutation.variables === contract.id}
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
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ContractsList;
