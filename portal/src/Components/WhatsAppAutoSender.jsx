import { useEffect, useRef } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { toast } from 'react-hot-toast';

/**
 * A helper component that monitors notifications and attempts to 
 * "auto-send" WhatsApp messages for 1-day reminders.
 * NOTE: Browsers will block window.open unless it's a user gesture.
 * This component will attempt it and notify the user if blocked.
 */
const WhatsAppAutoSender = () => {
    const { adminNotifications } = useNotifications();
    const processedRef = useRef(new Set());

    useEffect(() => {
        if (!adminNotifications) return;

        const pendingAutoReminders = adminNotifications.filter(n => 
            n.notification_type === 'customer_reminder_sent' && 
            n.status === 'unread' &&
            !processedRef.current.has(n.id)
        );

        pendingAutoReminders.forEach(notification => {
            processedRef.current.add(notification.id);
            
            const customers = notification.jobs?.customers;
            const contact = customers?.customer_details?.contact;
            
            if (contact) {
                const customerName = customers?.customer_details?.name || 'Customer';
                const vehicleModel = customers?.vehicle_details?.model || 'vehicle';
                const expiryDate = notification.jobs?.expiry_date;
                
                const message = encodeURIComponent(
                    `Hello ${customerName}, your ${vehicleModel} service is expiring tomorrow (${expiryDate}). Please contact us to schedule! - Garage Management`
                );
                
                const wpUrl = `https://wa.me/${contact.replace(/\D/g, '')}?text=${message}`;
                
                toast((t) => (
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-sm">📢 Auto-Reminder Ready for {customerName}</span>
                        <button
                            onClick={() => {
                                window.open(wpUrl, '_blank');
                                toast.dismiss(t.id);
                            }}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-200"
                        >
                            Confirm Send to WhatsApp
                        </button>
                    </div>
                ), { duration: 10000, position: 'top-right' });
            }
        });
    }, [adminNotifications]);

    return null;
};

export default WhatsAppAutoSender;
