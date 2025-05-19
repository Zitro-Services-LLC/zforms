
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Download, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface AdminActivity {
  id: string;
  admin_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  action_details: any;
  created_at: string;
  admin: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

const ActivityLogsPage: React.FC = () => {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionType, setActionType] = useState<string>('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Query admin activities with admin profile data
        const { data, error } = await supabase
          .from('admin_activities')
          .select(`
            *,
            admin:admin_id (
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching admin activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Filter activities based on search term and action type
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.entity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action_type?.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Use the effective filter - treat "all" as no filter
    const effectiveFilter = actionType === 'all' ? undefined : actionType;
    const matchesActionType = !effectiveFilter || activity.action_type === effectiveFilter;
    
    return matchesSearch && matchesActionType;
  });
  
  // Extract unique action types for filtering
  const actionTypes = [...new Set(activities.map(a => a.action_type))];
  
  const getActionTypeBadge = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <Badge className="bg-green-500">Created</Badge>;
      case 'update':
        return <Badge className="bg-blue-500">Updated</Badge>;
      case 'delete':
        return <Badge className="bg-red-500">Deleted</Badge>;
      case 'login':
        return <Badge className="bg-purple-500">Login</Badge>;
      case 'impersonate':
        return <Badge className="bg-amber-500">Impersonated</Badge>;
      default:
        return <Badge>{actionType}</Badge>;
    }
  };
  
  const getEntityTypeBadge = (entityType: string) => {
    switch (entityType) {
      case 'contractor':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Contractor</Badge>;
      case 'customer':
        return <Badge variant="outline" className="border-green-500 text-green-600">Customer</Badge>;
      case 'setting':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Setting</Badge>;
      default:
        return <Badge variant="outline">{entityType}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground">
              Track all admin actions and system activities.
            </p>
          </div>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Logs
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Admin Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center w-full sm:w-auto gap-2">
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    {actionTypes
                      .filter((type): type is string => Boolean(type))
                      .map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading activity logs...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No activities found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            {activity.admin?.first_name && activity.admin?.last_name
                              ? `${activity.admin.first_name} ${activity.admin.last_name}`
                              : activity.admin?.email || 'Unknown'}
                          </TableCell>
                          <TableCell>{getActionTypeBadge(activity.action_type)}</TableCell>
                          <TableCell>{getEntityTypeBadge(activity.entity_type)}</TableCell>
                          <TableCell>
                            {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
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

export default ActivityLogsPage;
