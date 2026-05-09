import { supabase } from '../lib/supabaseClient';

export async function fetchStockHistory() {
  // Fetch Stock In (Purchases)
  const { data: stockIn, error: inError } = await supabase
    .from('purchases')
    .select(`
      *,
      vendors (name),
      parts (part_name, sku)
    `)
    .order('purchase_date', { ascending: false });

  if (inError) throw inError;

  // Fetch Stock Out (Mechanic Inventory)
  const { data: stockOut, error: outError } = await supabase
    .from('mechanic_inventory')
    .select(`
      *,
      profiles:mechanic_id (full_name),
      parts (part_name, sku)
    `)
    .order('purchased_at', { ascending: false });

  if (outError) throw outError;

  return {
    stockIn,
    stockOut
  };
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
