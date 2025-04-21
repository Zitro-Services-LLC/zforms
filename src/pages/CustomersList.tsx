
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/layouts/AppLayout';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getCustomers, deleteCustomer } from '@/services/customerService';
import type { Customer } from '@/types/customer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const CustomersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSupabaseAuth();

  // Unified queryKey for better cache consistency
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(user?.id),
    enabled: !!user?.id,
    refetchOnWindowFocus: true, // Always refetch on focus for freshest view
  });

  // Force refetch on navigation if EditCustomer page indicated an update just happened
  React.useEffect(() => {
    if (location.state?.forceRefetch) {
      console.log("Forcing refetch of customer list due to update");
      refetch();
      // Remove the state so it doesn't refetch every render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, refetch, navigate]);

  React.useEffect(() => {
    // Add a log to verify we see updated data after edits
    console.log("Fetched customers from CustomersList:", customers);
  }, [customers]);

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Could not delete customer. Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleDeleteCustomer = (id: string) => {
    deleteCustomerMutation.mutate(id);
  };

  return (
    <AppLayout userType="contractor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <Button onClick={() => navigate('/customers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : isError ? (
              <div className="text-center py-4 text-red-500">
                Error loading customers. Please try again.<br />
                <span className="text-xs">{(error as Error)?.message}</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No customers found. Add your first customer to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Billing Address</TableHead>
                      <TableHead>Property Address</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.first_name} {customer.last_name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || "-"}</TableCell>
                        <TableCell>{customer.billing_address || "-"}</TableCell>
                        <TableCell>
                          {customer.same_as_billing ? customer.billing_address : customer.property_address || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => navigate(`/customers/edit/${customer.id}`)}
                              title={`Edit ${customer.first_name} ${customer.last_name}`}
                              aria-label={`Edit ${customer.first_name} ${customer.last_name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  title={`Delete ${customer.first_name} ${customer.last_name}`}
                                  aria-label={`Delete ${customer.first_name} ${customer.last_name}`}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {customer.first_name} {customer.last_name}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    {deleteCustomerMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CustomersList;

