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

export async function addVendor(vendorData) {
  const { data, error } = await supabase
    .from('vendors')
    .insert([vendorData])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function updateVendor({ id, vendorData }) {
  const { data, error } = await supabase
    .from('vendors')
    .update(vendorData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteVendor(id) {
  const { data, error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Delete failed or vendor not found.');
  return true;
}
