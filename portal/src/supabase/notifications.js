import { supabase } from "../lib/supabaseClient";
import { fetchMechanics } from "./adminMechanic";

export const fetchAdminNotifications = async () => {
  // Fetch everything separately to bypass missing FK relationships (PGRST200 errors)
  const [notificationsRes, mechanics, jobsRes] = await Promise.all([
    supabase.from('notifications').select('*').order('created_at', { ascending: false }),
    fetchMechanics(),
    supabase.from('jobs').select('*')
  ]);

  if (notificationsRes.error) throw notificationsRes.error;
  
  const notifications = notificationsRes.data;
  const jobs = jobsRes.data || [];

  // Manual client-side join
  return notifications.map(notification => {
    const mechanic = mechanics.find(m => m.id === notification.mechanic_id);
    const job = jobs.find(j => j.id === notification.job_id);

    return {
      ...notification,
      profiles: mechanic ? {
        full_name: mechanic.full_name || mechanic.name,
        role: mechanic.role
      } : null,
      jobs: job || null
    };
  });
};

export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ status: 'read' })
    .eq('id', notificationId);

  if (error) throw error;
  return data;
};