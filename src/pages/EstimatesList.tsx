
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEstimates, deleteEstimate } from '@/services/estimate'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import AppLayout from '@/components/layouts/AppLayout'
import DownloadPdfButton from '@/components/shared/DownloadPdfButton'
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog'
import { useToast } from '@/hooks/use-toast'

type EstimateWithCustomer = Awaited<ReturnType<typeof getEstimates>>[number]

function formatEstimateNumber(idx: number) {
  // EST-00001, EST-00002, etc
  return `EST-${(idx + 1).toString().padStart(5, '0')}`
}

export function EstimatesList() {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data: estimates = [], isLoading, isError } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => getEstimates(user?.id),
    enabled: Boolean(user?.id),
    staleTime: 0
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates', user?.id] })
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error deleting estimate",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    }
  })

  React.useEffect(() => {
    console.log('Auth state:', user)
    console.log('Estimates query:', { isLoading, isError, count: estimates.length })
  }, [user, isLoading, isError, estimates.length])

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
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500">
              Error loading estimates.
            </div>
          ) : estimates.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No estimates found. Click <b>New Estimate</b> to create your first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((est, idx) => (
                  <TableRow key={est.id}>
                    <TableCell>
                      {formatEstimateNumber(idx)}
                    </TableCell>
                    <TableCell>{est.title}</TableCell>
                    <TableCell>
                      {est.customer
                        ? `${est.customer.first_name} ${est.customer.last_name}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {est.date ? new Date(est.date).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      {typeof est.total === 'number'
                        ? `$${Number(est.total).toFixed(2)}`
                        : '--'}
                    </TableCell>
                    <TableCell className="capitalize">{est.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild title="View">
                          <Link to={`/estimates/${est.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <DownloadPdfButton documentType="estimate" documentId={est.id} compact />
                        <DeleteConfirmDialog
                          title="Delete Estimate"
                          description={`Are you sure you want to delete this estimate for ${est.customer ? `${est.customer.first_name} ${est.customer.last_name}` : 'unknown customer'}?`}
                          onDelete={() => deleteMutation.mutate(est.id)}
                          isDeleting={deleteMutation.isPending && deleteMutation.variables === est.id}
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
  )
}

export default EstimatesList
