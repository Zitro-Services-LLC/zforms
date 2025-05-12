
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoice, 
  submitInvoice,
  markInvoicePaid,
  recordPayment,
  InvoiceFormData,
  PaymentFormData
} from '@/services/invoice';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

export function useInvoices() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const invoicesQuery = useQuery({
    queryKey: ['invoices'],
    queryFn: () => userId ? getInvoices(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (data: InvoiceFormData) => {
      if (!userId) throw new Error('User not authenticated');
      return createInvoice({ ...data, user_id: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice created',
        description: 'The invoice has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating invoice',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<InvoiceFormData> }) => {
      return updateInvoice(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice updated',
        description: 'The invoice has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating invoice',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => submitInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice submitted',
        description: 'The invoice has been sent to the customer.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting invoice',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice marked as paid',
        description: 'The invoice has been marked as paid.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error marking invoice as paid',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (data: PaymentFormData) => recordPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Payment recorded',
        description: 'The payment has been recorded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error recording payment',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    invoicesQuery,
    createMutation,
    updateMutation,
    submitMutation,
    markPaidMutation,
    recordPaymentMutation,
  };
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => id ? getInvoiceById(id) : null,
    enabled: !!id,
  });
}
