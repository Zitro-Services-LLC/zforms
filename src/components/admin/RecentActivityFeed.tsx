
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminActivity } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { FileEdit, Trash, UserPlus, RefreshCw, Settings } from 'lucide-react';

interface RecentActivityFeedProps {
  activities: AdminActivity[];
  isLoading: boolean;
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities, isLoading }) => {
  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <FileEdit className="h-4 w-4 text-amber-500" />;
      case 'delete':
        return <Trash className="h-4 w-4 text-red-500" />;
      case 'system_update':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActivityDescription = (activity: AdminActivity) => {
    const { action_type, entity_type, action_details } = activity;
    
    switch (`${action_type}_${entity_type}`) {
      case 'create_contractor':
        return `Created new contractor ${action_details?.name || ''}`;
      case 'update_contractor':
        return `Updated contractor information`;
      case 'update_system_setting':
        return `Updated system setting: ${action_details?.key || ''}`;
      case 'create_admin':
        return `Added new admin user`;
      default:
        return `${action_type} operation on ${entity_type}`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
        <CardDescription>Latest admin activities in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-sm text-gray-500">No recent activities found</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.action_type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{getActivityDescription(activity)}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
