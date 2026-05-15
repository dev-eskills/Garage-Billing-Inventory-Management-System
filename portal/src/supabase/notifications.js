import { supabase } from "../lib/supabaseClient";
import { fetchMechanics } from "./adminMechanic";

/**
 * Fetch notifications for the admin panel
 */
export const fetchAdminNotifications = async (adminId) => {
  const [notificationsRes, mechanics, jobsRes] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .or(`receiver_id.eq.${adminId},receiver_id.is.null`)
      .order("created_at", { ascending: false }),
    fetchMechanics(),
    supabase.from("jobs").select("*, customers(*)"),
  ]);

  if (notificationsRes.error) throw notificationsRes.error;

  const notifications = notificationsRes.data;
  const jobs = jobsRes.data || [];

  return notifications.map((notification) => {
    const mechanic = mechanics.find((m) => m.id === (notification.mechanic_id || notification.sender_id));
    const job = jobs.find((j) => j.id === notification.job_id);

    return {
      ...notification,
      mechanic: mechanic
        ? {
            full_name: mechanic.full_name || mechanic.name,
            role: mechanic.role,
          }
        : null,
      jobs: job || null,
    };
  });
};

/**
 * Fetch all admin users
 */
export const fetchAdmins = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "admin");

  if (error) throw error;
  return data;
};

/**
 * Fetch notifications for a specific mechanic
 */
// export const fetchMechanicNotifications = async (mechanicId) => {
//   const { data, error } = await supabase
//     .from("notifications")
//     .select("*, jobs(*, customers(*))")
//     .or(`mechanic_id.eq.${mechanicId},receiver_id.eq.${mechanicId},sender_id.eq.${mechanicId}`)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// };

export const fetchMechanicNotifications = async (mechanicId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*, jobs(*, customers(*))")
    // Filter for notifications intended for this mechanic OR about this mechanic 
    // (excluding messages they sent to others)
    .or(`receiver_id.eq.${mechanicId},and(mechanic_id.eq.${mechanicId},notification_type.neq.admin_notification,notification_type.neq.customer_reminder)`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Additional safety filter: if I am the sender and NOT the receiver, 
  // it shouldn't be in my inbox (unless it's a personal reminder)
  return (data || []).filter(n => {
    if (n.sender_id === mechanicId && n.receiver_id !== mechanicId) {
        if (n.notification_type === 'admin_notification' || n.notification_type === 'customer_reminder') {
            return false;
        }
    }
    return true;
  });
};

/**
 * Create a new notification
 */
export const createNotification = async (notificationData) => {
  // 1. Always get the current logged-in user as the SENDER
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required to send notifications");

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        sender_id: user.id, // Current authenticated user is always the sender
        receiver_id: notificationData.receiver_id || null, // Specific target receiver
        mechanic_id: notificationData.mechanic_id || null,
        job_id: notificationData.job_id || null,
        title: notificationData.title,
        message: notificationData.message,
        notification_type: notificationData.notification_type || "info",
        status: "unread",
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Notification Error:", error.message);
    throw error;
  }
  return data[0];
};
// export const createNotification = async (notificationData) => {
//   const { data, error } = await supabase
//     .from("notifications")
//     .insert([
//       {
//         mechanic_id: notificationData.mechanic_id, // Sender
//         receiver_id: notificationData.receiver_id || null, // Specific receiver if any (e.g. admin or specific mechanic)
//         job_id: notificationData.job_id || null,
//         title: notificationData.title,
//         message: notificationData.message,
//         notification_type: notificationData.notification_type || "info",
//         status: "unread",
//         created_at: new Date().toISOString(),
//       },
//     ])
//     .select();

//   if (error) throw error;
//   return data[0];
// };

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ status: "read" })
    .eq("id", notificationId);

  if (error) throw error;
  return data;
};

/**
 * Check for upcoming service expiries and generate notifications
 * This can be called on dashboard load
 */
export const checkAndGenerateExpirations = async () => {
  // 1. Fetch jobs that are expiring in 7 days and don't have a notification yet
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const oneWeekStr = oneWeekFromNow.toISOString().split("T")[0];

  const todayStr = new Date().toISOString().split("T")[0];

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .lte("expiry_date", oneWeekStr)
    .gte("expiry_date", todayStr);

  if (jobsError) throw jobsError;

  // 2. For each job, check if an 'expiry_alert' already exists
  for (const job of jobs) {
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("job_id", job.id)
      .eq("notification_type", "expiry_alert")
      .limit(1);

    if (!existing || existing.length === 0) {
      // Create notification
      await createNotification({
        mechanic_id: job.mechanic_id,
        job_id: job.id,
        title: "Service Expiry Reminder",
        message: `Service for ${job.customers?.customer_details?.name || "Customer"}'s vehicle is expiring soon on ${job.expiry_date}.`,
        notification_type: "expiry_alert",
      });
    }
  }
};