import React from 'react';
import {
  Bell,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  Wrench,
  Phone,
  Car
} from 'lucide-react';
import WhatsAppButton from '../common/WhatsAppButton';

const NotificationList = ({ notifications, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'expiry_alert':
        return <Clock size={16} className="text-orange-500" />;
      case 'repair_alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'success':
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  if (notifications?.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell size={32} className="mx-auto text-gray-200 mb-2" />
        <p className="text-xs font-medium text-gray-400">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto custom-scrollbar">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${notification.status === 'unread' ? 'bg-blue-50/20' : ''}`}
          onClick={() => onMarkAsRead(notification.id)}
        >
          <div className="flex gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${notification.status === 'unread' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
              {getNotificationIcon(notification.notification_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[13px] leading-tight ${notification.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                  {notification.title}
                </p>
                {notification.status === 'unread' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed font-medium italic">
                "{notification.message}"
              </p>

              {/* Contextual Details Box */}
              <div className="mt-3 bg-gray-50/80 rounded-md border border-gray-100/50 overflow-hidden">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    {notification.jobs?.customer_details && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User size={12} className="text-emerald-600 shrink-0" />
                        <span className="text-xs text-gray-700 truncate tracking-tight font-medium">
                          {notification.jobs.customer_details.name}
                        </span>
                      </div>
                    )}
                    {notification.jobs?.vehicle_details && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Car size={10} className="text-blue-600 shrink-0" />
                        <span className="text-xs text-gray-600 truncate tracking-tight font-medium">
                          {notification.jobs.vehicle_details.name} ({notification.jobs.vehicle_details.number})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 border-l border-gray-200 pl-2">
                    {notification.mechanic && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Wrench size={10} className="text-orange-500 shrink-0" />
                        <span className="text-xs text-gray-700 truncate tracking-tight font-medium">
                          {notification.mechanic.full_name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-gray-500 truncate tracking-tight font-medium">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className=" py-1.5 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Phone size={10} className="text-gray-400" />
                    <span className="text-xs  text-gray-500 tracking-tighter">
                      {notification.jobs?.customer_details?.contact}
                    </span>
                  </div>
                  <WhatsAppButton notification={notification} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
