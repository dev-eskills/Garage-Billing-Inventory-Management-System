import { supabase } from '../lib/supabaseClient';

export async function fetchVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendors:', error.message);
    throw error;
  }
  return data;
}

export async function fetchAllVendorsWithParts() {
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      *,
      parts (
        part_name,
        stock_quantity
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors with parts:', error.message);
    throw error;
  }
  return data;
}

export async function adminAddVendor({ name, email, phone, address }) {
  const { data, error } = await supabase
    .from('vendors')
    .insert([
      { 
        name: name, 
        email: email, 
        phone: phone, 
        address: address 
      }
    ])
    .select();

  if (error) {
    console.error('Error adding vendor:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function adminUpdateVendor(id, { name, email, phone, address }) {

  const { data, error } = await supabase
    .from('vendors')
    .update({ 
      name: name, 
      email: email, 
      phone: phone, 
      address: address 
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating vendor:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function adminDeleteVendor(id) {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vendor:', error.message);
    throw new Error(error.message);
  }
  return true;
}
