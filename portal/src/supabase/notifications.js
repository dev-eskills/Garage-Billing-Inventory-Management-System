import { supabase } from "../lib/supabaseClient";

export const fetchAdminNotifications = async () => {
  const { data, error, status } = await supabase
    .from('notifications')
    .select(`
      *,
      mechanic:profiles!mechanic_id (full_name, role),
      jobs (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
};

export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ status: 'read' })
    .eq('id', notificationId);

  if (error) throw error;
  return data;
};