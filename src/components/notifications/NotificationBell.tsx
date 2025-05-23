
import React, { useState, useEffect } from 'react';
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { getUnreadCount, markAllAsRead, initMockNotifications } from "@/services/notificationService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { NotificationsList } from "./NotificationsList";

export const NotificationBell: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize mock notifications for development
    initMockNotifications(user.id);

    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadCount();

    // For demo purposes, we'll simulate a new notification every minute
    const interval = setInterval(() => {
      setUnreadCount(prev => prev + 1);
      toast({
        title: "New Notification",
        description: "You have a new notification"
      });
    }, 60000); // 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, [user, toast]);

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllAsRead(user.id);
      setUnreadCount(0);
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <NotificationsList 
          onNotificationRead={() => setUnreadCount(prev => Math.max(0, prev - 1))}
        />
      </PopoverContent>
    </Popover>
  );
};
