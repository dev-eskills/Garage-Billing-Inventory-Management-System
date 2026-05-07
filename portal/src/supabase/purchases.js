import { supabase } from '../lib/supabaseClient';

export async function fetchPurchases() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      vendors (
        name,
        contact_person
      ),
      purchase_items (
        id,
        quantity,
        unit_cost,
        parts (
          id,
          part_name,
          sku
        )
      )
    `)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching purchases:', error.message);
    throw error;
  }
  return data;
}

export async function addPurchase({ purchaseData, items }) {
  // 1. Insert Purchase
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert([purchaseData])
    .select()
    .single();

  if (purchaseError) throw new Error(purchaseError.message);

  // 2. Insert Purchase Items
  const itemsToInsert = items.map(item => ({
    purchase_id: purchase.id,
    part_id: item.part_id,
    quantity: parseInt(item.quantity, 10),
    unit_cost: parseFloat(item.unit_cost)
  }));

  const { error: itemsError } = await supabase
    .from('purchase_items')
    .insert(itemsToInsert);

  if (itemsError) {
    // Attempt rollback (if RPC transaction isn't used)
    await supabase.from('purchases').delete().eq('id', purchase.id);
    throw new Error(itemsError.message);
  }

  // 3. Update stock_quantity for parts (this is best done via DB trigger, but doing it here if no trigger exists)
  // We will iterate through each item and increment the stock
  for (const item of itemsToInsert) {
    // Fetch current stock
    const { data: partData, error: partErr } = await supabase
      .from('parts')
      .select('stock_quantity')
      .eq('id', item.part_id)
      .single();
      
    if (!partErr && partData) {
      await supabase
        .from('parts')
        .update({ stock_quantity: partData.stock_quantity + item.quantity })
        .eq('id', item.part_id);
    }
  }

  return purchase;
}

export async function deletePurchase(id) {
  // Deleting the purchase should cascade delete purchase_items.
  // Note: if you need to revert stock, it's complex without an RPC. 
  const { data, error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Delete failed or purchase not found.');
  return true;
}
