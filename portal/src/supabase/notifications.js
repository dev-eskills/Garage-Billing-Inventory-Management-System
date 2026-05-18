import { supabase } from "../lib/supabaseClient";
import { fetchMechanics } from "./adminMechanic";
import { createReminder } from "./reminders";

/**
 * Fetch notifications for the admin panel
 */
export const fetchAdminNotifications = async (adminId) => {
  const [notificationsRes, mechanics, jobsRes] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .or(`receiver_id.eq.${adminId},sender_id.eq.${adminId},receiver_id.is.null,notification_type.eq.expiry_alert,notification_type.eq.customer_reminder_sent`)
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
    // Filter for notifications intended for this mechanic OR about this mechanic's jobs
    .or(`receiver_id.eq.${mechanicId},mechanic_id.eq.${mechanicId}`)
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
 * Check for upcoming service expiries and generate notifications/reminders
 * - 7 days before: Internal alert for Admin & Mechanic
 * - 1 day before: Automatic customer reminder (logged to history)
 */
export const checkAndGenerateExpirations = async () => {
  const today = new Date();

  // 1. Check for 7-day internal alerts
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);
  const oneWeekStr = oneWeekFromNow.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const { data: sevenDayJobs, error: sevenDayError } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .lte("expiry_date", oneWeekStr)
    .gte("expiry_date", todayStr);

  if (sevenDayError) throw sevenDayError;

  for (const job of (sevenDayJobs || [])) {
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("job_id", job.id)
      .eq("notification_type", "expiry_alert")
      .limit(1);

    if (!existing || existing.length === 0) {   
      // Create notification for BOTH admin and mechanic
      // By setting receiver_id to the mechanic, they definitely see it in their inbox
      // The admin will see it because we updated fetchAdminNotifications to include expiry_alerts
      await createNotification({
        receiver_id: job.mechanic_id  ,
        mechanic_id: job.mechanic_id,
        job_id: job.id,
        title: `Upcoming Service Expiry on ${job.expiry_date}`,
        message: `Service for ${job.customers?.customer_details?.name || "Customer"}'s vehicle (${job.customers?.vehicle_details?.vehicle_number || 'N/A'}) is expiring on ${job.expiry_date}.`,
        notification_type: "expiry_alert",
      });
    }
  }

  // 2. Check for 1-day automatic customer reminders
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { data: tomorrowJobs, error: tomorrowError } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .eq("expiry_date", tomorrowStr);

  if (tomorrowError) throw tomorrowError;

  for (const job of (tomorrowJobs || [])) {
    // Check if a reminder for this job was already sent/logged today
    const { data: existingReminder } = await supabase
      .from("reminders")
      .select("id")
      .eq("vehicle_no", job.customers?.vehicle_details?.vehicle_number)
      .eq("expiry_date", job.expiry_date)
      .limit(1);

    if (!existingReminder || existingReminder.length === 0) {
      // 1. Log to reminders table for history
      await createReminder({
        customer_name: job.customers?.customer_details?.name || "Customer",
        vehicle_no: job.customers?.vehicle_details?.vehicle_number || "N/A",
        contact_info: job.customers?.customer_details?.contact || "N/A",
        type: "automatic_expiry",
        title: "Service Expiry Reminder (1 Day)",
        expiry_date: job.expiry_date,
        status: "sent"
      });

      // 2. Create a notification for admin/mechanic
      // Setting receiver_id to mechanic ensures they get the alert
      await createNotification({
        receiver_id: job.mechanic_id,
        mechanic_id: job.mechanic_id,
        job_id: job.id,
        title: "Customer Reminder Sent (1 Day)",
        message: `An automatic expiry reminder has been logged for ${job.customers?.customer_details?.name}. Expiry tomorrow: ${job.expiry_date}.`,
        notification_type: "customer_reminder_sent",
      });

      // 3. Note on WhatsApp: In a real-world scenario with an API, 
      // we would trigger the WhatsApp send here. 
      // For now, it's logged and the team is notified to follow up if needed.
    }
  }
};