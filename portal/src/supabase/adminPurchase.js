import { supabase } from '../lib/supabaseClient';

export async function adminAddPurchase({ vendor_id, total_amount, purchase_date, payment_status, quantity, part_id }) {
  // First, insert the main purchase record
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .insert([
      { 
        vendor_id, 
        total_amount, 
        purchase_date: payment_status === 'Paid' ? new Date().toISOString() : purchase_date,
        payment_status ,
        quantity,
        part_id
      }
    ])
    .select();

  if (purchaseError) {
    console.error('Error adding purchase:', purchaseError.message);
    throw new Error(purchaseError.message);
  }
  return purchaseData
}

export async function adminFetchPurchases() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      vendors (
        name,
        email
      ),
      parts (
        part_name,
        sku,
        unit_price
      )
    `)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching purchases:', error.message);
    throw error;
  }
  return data;
}

export async function adminUpdatePurchaseStatus(id, status) {
  const updateData = { payment_status: status };
  if (status === 'Paid') {
    updateData.purchase_date = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from('purchases')
    .update(updateData)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDeletePurchase(id) {
  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting purchase:', error.message);
    throw new Error(error.message);
  }
  return true;
}
