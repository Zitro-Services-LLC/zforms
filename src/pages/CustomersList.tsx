
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from '@/types/customer';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) {
        throw error;
      }

      // Transform data to match our Customer type
      const formattedCustomers: Customer[] = data.map(customer => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        profile_image_url: customer.profile_image_url,
        billing_address: customer.billing_address,
        property_address: customer.property_address,
        same_as_billing: customer.same_as_billing,
        user_id: customer.user_id
      }));
      
      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Could not fetch customers. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCustomers(customers.filter(customer => customer.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Could not delete customer. Please try again later.",
        variant: "destructive"
      });
    }
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
            {loading ? (
              <div className="text-center py-4">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No customers found. Add your first customer to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Billing Address</TableHead>
                    <TableHead>Property Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.billing_address}</TableCell>
                      <TableCell>
                        {customer.same_as_billing ? customer.billing_address : customer.property_address}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CustomersList;
