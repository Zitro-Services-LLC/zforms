
import React from 'react';
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

const CustomersList = () => {
  const navigate = useNavigate();
  const mockCustomers = [
    { 
      id: '1', 
      name: 'Alice Smith', 
      email: 'alice@example.com', 
      phone: '(555) 123-4567', 
      billingAddress: '123 Main St',
      propertyAddress: '123 Main St',
      sameAsBilling: true
    },
    { 
      id: '2', 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      phone: '(555) 234-5678', 
      billingAddress: '456 Oak Ave',
      propertyAddress: '789 Pine St',
      sameAsBilling: false
    },
  ];

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
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.billingAddress}</TableCell>
                    <TableCell>
                      {customer.sameAsBilling ? customer.billingAddress : customer.propertyAddress}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CustomersList;
