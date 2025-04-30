
import React from 'react';
import { 
  Activity, Clock, FileText, Eye, MessageSquare,
  PenTool, Send, Download, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import type { EstimateActivity } from '@/types/database.d';

type ActivityIconProps = {
  actionType: EstimateActivity['action_type'];
  className?: string;
};

const ActivityIcon: React.FC<ActivityIconProps> = ({ actionType, className = "h-5 w-5" }) => {
  switch (actionType) {
    case 'created':
      return <FileText className={className} />;
    case 'updated':
      return <PenTool className={className} />;
    case 'status_changed':
      return <Activity className={className} />;
    case 'viewed':
      return <Eye className={className} />;
    case 'commented':
      return <MessageSquare className={className} />;
    case 'requested_changes':
      return <AlertCircle className={className} />;
    case 'sent':
      return <Send className={className} />;
    case 'exported':
      return <Download className={className} />;
    default:
      return <Clock className={className} />;
  }
};

const getActionText = (activity: EstimateActivity): string => {
  const details = activity.action_details || {};
  
  switch (activity.action_type) {
    case 'created':
      return `Estimate ${details.status === 'draft' ? 'draft created' : 'created and submitted'}`;
    case 'updated':
      return 'Estimate updated';
    case 'status_changed':
      return `Status changed to ${details.status}`;
    case 'viewed':
      return details.by_client ? 'Viewed by customer' : 'Viewed by you';
    case 'commented':
      return 'Comment added';
    case 'requested_changes':
      return 'Changes requested by customer';
    case 'sent':
      return 'Estimate sent to customer';
    case 'exported':
      return `Exported as ${details.format || 'PDF'}`;
    default:
      return 'Activity logged';
  }
};

const getActivityColor = (actionType: EstimateActivity['action_type']): string => {
  switch (actionType) {
    case 'created':
      return 'text-green-600 bg-green-100';
    case 'updated':
      return 'text-blue-600 bg-blue-100';
    case 'status_changed':
      return 'text-purple-600 bg-purple-100';
    case 'viewed':
      return 'text-gray-600 bg-gray-100';
    case 'commented':
      return 'text-amber-600 bg-amber-100';
    case 'requested_changes':
      return 'text-red-600 bg-red-100';
    case 'sent':
      return 'text-indigo-600 bg-indigo-100';
    case 'exported':
      return 'text-emerald-600 bg-emerald-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

interface EstimateActivitiesProps {
  activities: EstimateActivity[];
  className?: string;
}

const EstimateActivities: React.FC<EstimateActivitiesProps> = ({ 
  activities, 
  className = "" 
}) => {
  if (!activities.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No activity recorded yet
      </div>
    );
  }

  // Group activities by date
  const groupedActivities: Record<string, EstimateActivity[]> = {};
  activities.forEach((activity) => {
    const date = new Date(activity.created_at).toDateString();
    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    groupedActivities[date].push(activity);
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500">
            {format(new Date(date), "MMMM d, yyyy")}
          </h3>
          
          <div className="space-y-3">
            {dayActivities.map((activity) => {
              const colorClass = getActivityColor(activity.action_type);
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <ActivityIcon actionType={activity.action_type} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{getActionText(activity)}</p>
                      <time className="text-sm text-gray-500">
                        {format(new Date(activity.created_at), "h:mm a")}
                      </time>
                    </div>
                    
                    {activity.action_details?.comment && (
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                        "{activity.action_details.comment}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  );
};

export default EstimateActivities;
