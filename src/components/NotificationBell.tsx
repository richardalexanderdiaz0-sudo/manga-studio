import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/src/contexts/AuthContext';
import { getNotifications, markNotificationAsRead } from '@/src/services/workService';
import { AppNotification } from '@/src/types';
import { Button, Badge } from '@/src/components/ui';
import { Link } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getNotifications(user.uid, (updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.is_read).length);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative h-10 w-10 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border bg-white shadow-2xl"
            >
              <div className="border-b p-4">
                <h3 className="font-bold">Notificaciones</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell className="mx-auto mb-2 h-8 w-8 opacity-20" />
                    <p className="text-sm">No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 transition-colors ${notification.is_read ? 'bg-white' : 'bg-indigo-50/50'}`}
                      >
                        <div className="flex justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-bold">{notification.title}</p>
                            <p className="text-xs text-slate-600">{notification.message}</p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {!notification.is_read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => handleMarkAsRead(notification.id!)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            {notification.link && (
                              <Link 
                                to={notification.link} 
                                onClick={() => {
                                  setIsOpen(false);
                                  if (!notification.isRead) handleMarkAsRead(notification.id!);
                                }}
                              >
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
