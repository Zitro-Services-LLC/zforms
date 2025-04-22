
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getEstimates } from '@/services/estimateService'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

type EstimateWithCustomer = Awaited<ReturnType<typeof getEstimates>>[number]

export function EstimatesList() {
  const { user } = useSupabaseAuth()

  const { data: estimates = [], isLoading, isError } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => getEstimates(user?.id),
    enabled: Boolean(user?.id),
    keepPreviousData: false,
  })

  React.useEffect(() => {
    console.log('Auth state:', user)
    console.log('Estimates query:', { isLoading, isError, count: estimates.length })
  }, [user, isLoading, isError, estimates.length])

  if (isLoading)   return <div>Loading…</div>
  if (isError)     return <div>Error loading estimates</div>
  if (!estimates.length) return <div>No estimates found</div>

  return (
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
  )
}

export default EstimatesList
