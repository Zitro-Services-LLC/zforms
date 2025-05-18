
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Server } from 'lucide-react';
import { SystemSetting } from '@/types/admin';

interface SystemOverviewProps {
  settings: SystemSetting[];
  isLoading: boolean;
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ settings, isLoading }) => {
  // Get system status from settings
  const systemStatus = settings.find(s => s.key === 'system_status')?.value as string || 'operational';
  const maintenanceMode = settings.find(s => s.key === 'maintenance_mode')?.value === true;
  const lastBackup = settings.find(s => s.key === 'last_backup_date')?.value as string;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Server className="mr-2 h-5 w-5 text-amber-500" />
            System Status
          </CardTitle>
          <CardDescription>Current system operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Status:</span>
              {systemStatus === 'operational' ? (
                <Badge className="bg-green-500">{systemStatus}</Badge>
              ) : systemStatus === 'degraded' ? (
                <Badge className="bg-amber-500">{systemStatus}</Badge>
              ) : (
                <Badge className="bg-red-500">{systemStatus}</Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span>Maintenance Mode:</span>
              <Badge className={maintenanceMode ? "bg-amber-500" : "bg-green-500"}>
                {maintenanceMode ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Last Backup:</span>
              <span>{lastBackup ? new Date(lastBackup).toLocaleString() : 'No backup recorded'}</span>
            </div>
          </div>
          
          {maintenanceMode && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription>
                System is currently in maintenance mode. Some features may be unavailable.
              </AlertDescription>
            </Alert>
          )}
          
          {systemStatus === 'operational' && !maintenanceMode && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                All systems operational.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;
