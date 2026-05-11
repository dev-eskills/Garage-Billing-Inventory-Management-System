import { supabase } from "../lib/supabaseClient";

export const createCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([
      {
        mechanic_id: customerData.mechanic_id,
        customer_details: {
          name: customerData.name,
          contact: customerData.contact
        },
        vehicle_details: {
          model: customerData.model,
          vehicle_number: customerData.vehicle_number
        }
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
};

export const fetchMechanicCustomers = async (mechanicId) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('mechanic_id', mechanicId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateCustomer = async ({ id, ...updateData }) => {
  const { data, error } = await supabase
    .from('customers')
    .update({
      customer_details: {
        name: updateData.name,
        contact: updateData.contact
      },
      vehicle_details: {
        model: updateData.model,
        vehicle_number: updateData.vehicle_number
      }
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};


export const fetchCustomerById = async (id) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer:", error.message);
    throw error;
  }

  return data;
};