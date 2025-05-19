
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminSetup from '@/components/admin/AdminSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDevSetup: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Development Setup</h1>
          <p className="text-muted-foreground">Configure development settings and manage admin test accounts.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AdminSetup />
          
          <Card>
            <CardHeader>
              <CardTitle>Development Settings</CardTitle>
              <CardDescription>
                Configuration for the development environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <AlertTitle className="text-amber-800">Development Mode</AlertTitle>
                <AlertDescription className="text-amber-700">
                  <strong>Important:</strong> Email verification must be disabled in Supabase for the admin setup to work properly.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-800">Supabase Configuration</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p>Please follow these steps in the Supabase Console:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Go to Authentication &gt; Providers</li>
                    <li>Under Email, toggle "Confirm email" to OFF</li>
                    <li>If you already created an admin user, you may need to delete it and create it again</li>
                  </ol>
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-green-50 border-green-200 mt-4">
                <Info className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-800">Login with Admin Account</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p>To login with the admin account:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Go to the <Link to="/auth" className="text-green-600 hover:underline">Auth Page</Link></li>
                    <li>Use the email: zitro.admin@example.com</li>
                    <li>Password: admin790</li>
                    <li>If you forgot the password, use the Reset Password button above</li>
                  </ol>
                </AlertDescription>
              </Alert>
              
              <div className="pt-2">
                <Link to="/admin" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Back to Admin Dashboard &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDevSetup;
