
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getEstimates } from '@/services/estimateService'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import AppLayout from '@/components/layouts/AppLayout'

type EstimateWithCustomer = Awaited<ReturnType<typeof getEstimates>>[number]

export function EstimatesList() {
  const { user } = useSupabaseAuth()

  const { data: estimates = [], isLoading, isError } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => getEstimates(user?.id),
    enabled: Boolean(user?.id),
    staleTime: 0
  })

  React.useEffect(() => {
    console.log('Auth state:', user)
    console.log('Estimates query:', { isLoading, isError, count: estimates.length })
  }, [user, isLoading, isError, estimates.length])

  return (
    <AppLayout userType="contractor">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Estimates</h1>
        {isLoading ? (
          <div>Loading…</div>
        ) : isError ? (
          <div>Error loading estimates</div>
        ) : !estimates.length ? (
          <div>No estimates found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map(est => (
                <TableRow key={est.id}>
                  <TableCell>{est.id.slice(0, 8)}</TableCell>
                  <TableCell>{est.title}</TableCell>
                  <TableCell>
                    {est.customer
                      ? `${est.customer.first_name} ${est.customer.last_name}`
                      : '—'}
                  </TableCell>
                  <TableCell>{new Date(est.date).toLocaleDateString()}</TableCell>
                  <TableCell>{`$${Number(est.total).toFixed(2)}`}</TableCell>
                  <TableCell>{est.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  )
}

export default EstimatesList
