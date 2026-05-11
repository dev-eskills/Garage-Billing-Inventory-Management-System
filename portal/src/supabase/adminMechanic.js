import { supabase, adminAuthClient } from '../lib/supabaseClient';

export async function adminAddMechanic({ email, password, name, contact, address }) {
  const { data, error } = await adminAuthClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone: contact,
        address:address,
        role: 'mechanic', 
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMechanics() {
  const { data, error } = await supabase.rpc('get_mechanics');
  if (error) {
    console.error('Error fetching mechanics:', error.message);
    return [];
  }
  return data;
}

export async function updateMechanicDetails({ id, formData }) {
  const { data, error } = await supabase.rpc('update_mechanic', {
    target_user_id: id,
    new_full_name: formData.name || '',  
    new_phone: formData.contact || '', 
    new_address: formData.address || ''
  });

  if (error) {
    console.error('Update failed:', error);
    throw error;
  }
  return data;
}

export async function updateMechanicPassword({ id, newPassword }) {
  const { data, error } = await supabase.rpc('admin_change_password', {
    target_user_id: id,
    new_password: newPassword
  });

  if (error) {
    console.error('Password update failed:', error.message);
    throw error;
  }
  
  return data;
}

export async function deleteMechanic(id) {
    const userId = typeof id === 'object' ? id.id : id;
    const { data, error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
    });
    if (error) {
        console.error('Deletion failed:', error.message);
        throw error;
    }
    return data;
}

export const fetchMechanicsJobs = async (mechanicId) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id,
      created_at,
      service_date,
      total_amount_full_service,
      job_info,
      customers (
        customer_details,
        vehicle_details
      ),
      invoices (
        storage_path,
        file_name
      )
    `)
    .eq('mechanic_id', mechanicId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("DEBUG FETCH MECHANICS JOB:", error.message, error.details, error.hint);
    throw error;
  }
  return data;
};