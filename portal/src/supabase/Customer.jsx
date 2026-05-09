// supabase/customers.js
import { supabase } from "../lib/supabaseClient";

/**
 * Add a new customer
 */
export async function addCustomer(customerData, mechanicId) {
  try {
    const payload = {
      customer_details: {
        name: customerData.full_name || "",
        contact: customerData.phone || "",
      },
      vehicle_details: {
        model: customerData.vehicle_model || "",
        vehicle_number: customerData.vehicle_number || "",
      },
      mechanic_id: mechanicId, // typically from supabase.auth.user().id
    };

    const { data, error } = await supabase
      .from("customers")
      .insert([payload])
      .select();

    if (error) throw error;

    console.log("Customer added:", data);
    return data[0];
  } catch (err) {
    console.error("Error adding customer:", err);
    return null;
  }
}

/**
 * Fetch all customers (optionally by mechanic)
 */
export async function fetchCustomers(mechanicId = null) {
  try {
    let query = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (mechanicId) {
      query = query.eq("mechanic_id", mechanicId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching customers:", err);
    return [];
  }
}

/**
 * Search customers by full name or phone
 */
export async function searchCustomers(searchTerm) {
  if (!searchTerm) return fetchCustomers(); // if empty, return all

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .or(
        `customer_details->>full_name.ilike.%${searchTerm}%,customer_details->contact->>phone.ilike.%${searchTerm}%`,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error searching customers:", err);
    return [];
  }
}

/**
 * Delete a customer by ID
 */
export async function deleteCustomer(customerId) {
  if (!customerId) return null;

  try {
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId)
      .select();

    if (error) throw error;
    console.log("Customer deleted:", data);
    return data[0];
  } catch (err) {
    console.error("Error deleting customer:", err);
    return null;
  }
}
