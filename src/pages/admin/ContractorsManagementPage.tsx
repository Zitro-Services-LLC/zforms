
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Contractor {
  id: string;
  created_at: string;
  company_name: string;
  company_email: string;
  owner_first_name: string;
  owner_last_name: string;
  status?: string;
  subscription_tier?: string;
}

const ContractorsManagementPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        
        // Fetch contractors with their management details
        const { data, error } = await supabase
          .from('contractors')
          .select(`
            id,
            created_at,
            company_name,
            company_email,
            owner_first_name,
            owner_last_name,
            contractor_management (
              status,
              subscription_tier
            )
          `);
        
        if (error) throw error;
        
        // Transform the nested data structure
        const transformedData = data?.map(contractor => ({
          id: contractor.id,
          created_at: contractor.created_at,
          company_name: contractor.company_name,
          company_email: contractor.company_email,
          owner_first_name: contractor.owner_first_name || '',
          owner_last_name: contractor.owner_last_name || '',
          status: contractor.contractor_management?.[0]?.status || 'active',
          subscription_tier: contractor.contractor_management?.[0]?.subscription_tier || 'free'
        }));
        
        setContractors(transformedData || []);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContractors();
  }, []);
  
  // Filter contractors based on search term
  const filteredContractors = contractors.filter(contractor => 
    contractor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.company_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${contractor.owner_first_name} ${contractor.owner_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-500">Suspended</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge className="bg-purple-500">Premium</Badge>;
      case 'professional':
        return <Badge className="bg-blue-500">Professional</Badge>;
      case 'free':
        return <Badge className="bg-gray-500">Free</Badge>;
      default:
        return <Badge className="bg-gray-500">Free</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contractors Management</h1>
            <p className="text-muted-foreground">Manage contractor accounts and subscriptions.</p>
          </div>
          
          <Button>
            <Plus className="mr-1 h-4 w-4" /> Add Contractor
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search contractors..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="mr-1 h-4 w-4" /> Filter
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading contractors...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContractors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No contractors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContractors.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">{contractor.company_name}</TableCell>
                          <TableCell>{`${contractor.owner_first_name} ${contractor.owner_last_name}`}</TableCell>
                          <TableCell>{contractor.company_email}</TableCell>
                          <TableCell>{getStatusBadge(contractor.status || 'active')}</TableCell>
                          <TableCell>{getTierBadge(contractor.subscription_tier || 'free')}</TableCell>
                          <TableCell>
                            {contractor.created_at 
                              ? format(new Date(contractor.created_at), 'MMM d, yyyy') 
                              : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Login as User</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  Suspend Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContractorsManagementPage;
