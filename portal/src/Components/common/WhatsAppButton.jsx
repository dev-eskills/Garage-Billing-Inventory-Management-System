import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ notification }) => {
  const { jobs, mechanic } = notification;
  const customerName = jobs?.customer_details?.name || 'Customer';
  const customerContact = jobs?.customer_details?.contact;
  const vehicleName = jobs?.vehicle_details?.name || 'your vehicle';
  const vehicleNumber = jobs?.vehicle_details?.number || '';
  const expiryDate = jobs?.expiry_date ? new Date(jobs.expiry_date).toLocaleDateString() : '';

  const generateMessage = () => {
    if (notification.notification_type === 'expiry_alert') {
      return `Hello ${customerName}, this is a reminder from our garage. Your vehicle ${vehicleName}${vehicleNumber ? ` (${vehicleNumber})` : ''} is due for service on ${expiryDate}. Please let us know when you'd like to schedule your visit!`;
    }
    
    // Generic message for other types
    return `Hello ${customerName}, regarding your ${vehicleName}: ${notification.message}`;
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    if (!customerContact) return;

    const message = encodeURIComponent(generateMessage());
    const wpUrl = `https://wa.me/${customerContact.replace(/\D/g, '')}?text=${message}`;
    window.open(wpUrl, '_blank');
  };

  if (!customerContact) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white transition-all cursor-pointer group/wp"
      title="Send WhatsApp Message"
    >
      <MessageCircle size={12} className="group-hover/wp:scale-110 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-tight">WhatsApp</span>
    </button>
  );
};

export default WhatsAppButton;
