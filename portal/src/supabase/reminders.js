import { supabase } from "../lib/supabaseClient";

/**
 * Fetch reminder history for a customer or mechanic
 */
export const fetchReminders = async () => {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Log a sent reminder to the database
 */
export const createReminder = async (reminderData) => {
  const { data, error } = await supabase
    .from("reminders")
    .insert([
      {
        customer_name: reminderData.customer_name,
        vehicle_no: reminderData.vehicle_no,
        contact_info: reminderData.contact_info,
        type: reminderData.type || "automatic",
        title: reminderData.title,
        issue_date: reminderData.issue_date || new Date().toISOString().split("T")[0],
        expiry_date: reminderData.expiry_date,
        status: reminderData.status || "sent",
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Error creating reminder log:", error.message);
    throw error;
  }
  return data[0];
};
