import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';
import { financialApi } from '../../services/financialApi';

interface Notification {
  id: string;
  type: 'overdue_premium' | 'policy_lapse' | 'claim_submitted' | 'underwriting_required';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const InsuranceNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock real-time notifications - in production would use WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'overdue_premium',
          title: 'Premium Overdue',
          message: 'Policy POL-2024-ABC123 has 15 days overdue premium',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'claim_submitted',
          title: 'New Claim Submitted',
          message: 'Death claim CLM-2024-XYZ789 submitted for policy POL-2024-DEF456',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ];
      
      setNotifications(prev => [...mockNotifications, ...prev.slice(0, 4)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue_premium': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'policy_lapse': return <X className="w-4 h-4 text-red-500" />;
      case 'claim_submitted': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'underwriting_required': return <CheckCircle2 className="w-4 h-4 text-sky-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-premium border border-slate-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Insurance Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2" />
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-sky-50/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{notification.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
