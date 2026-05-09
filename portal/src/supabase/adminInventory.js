import { supabase } from '../lib/supabaseClient';

export async function fetchStockIn() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      vendors (name),
      parts (part_name, sku, image_url)
    `)
    .order('purchase_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchStockOut() {
  const { data, error } = await supabase
    .from('mechanic_inventory')
    .select(`
      *,
      profiles:mechanic_id (full_name),
      parts (part_name, sku, image_url)
    `)
    .order('purchased_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchCurrentStock() {
  const { data, error } = await supabase
    .from('parts')
    .select(`
      *,
      vendors (name)
    `)
    .order('stock_quantity', { ascending: false });

  if (error) throw error;
  return data;
}
