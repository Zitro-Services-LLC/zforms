
import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { getNotifications, markAsRead, initMockNotifications } from "@/services/notificationService";
import type { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationsListProps {
  maxHeight?: number;
  onNotificationRead?: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ 
  maxHeight = 300,
  onNotificationRead
}) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Initialize mock notifications for development
    initMockNotifications(user.id);

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications(user.id, 20);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      if (onNotificationRead) onNotificationRead();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'warn60':
        return `License ${notification.payload?.license_no} will expire in about 60 days`;
      case 'warn30':
        return `License ${notification.payload?.license_no} will expire in about 30 days`;
      case 'warn7':
        return `License ${notification.payload?.license_no} will expire in less than a week`;
      case 'expired':
        return `License ${notification.payload?.license_no} has expired`;
      default:
        return 'New notification';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 border-blue-300';
      case 'warning': return 'bg-amber-100 border-amber-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">No notifications</div>;
  }

  return (
    <ScrollArea className="h-full" style={{ maxHeight: `${maxHeight}px` }}>
      <div className="divide-y">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 flex items-start gap-3 ${notification.is_read ? 'opacity-70' : ''} ${getLevelColor(notification.level)}`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{getNotificationContent(notification)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {notification.created_at && formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {!notification.is_read && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
