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

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
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

export async function updateMechanicDetails(id, formData) {
  const { data , error } = await supabase.rpc('update_mechanic', {
    target_user_id: id,
    new_full_name: formData.name,
    new_phone: formData.contact,
    new_address: formData.address
  });
  if (error) {
    console.error('Update failed:', error.message);
    throw error;
  }
  return data;
}