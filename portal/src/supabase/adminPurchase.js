import { supabase } from '../lib/supabaseClient';

export async function adminAddPurchase({ vendor_id, total_amount, purchase_date, payment_status, items }) {
  // First, insert the main purchase record
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .insert([
      { 
        vendor_id, 
        total_amount, 
        purchase_date: payment_status === 'paid' ? new Date().toISOString() : purchase_date,
        payment_status 
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
        name
      )
    `)
    .order('purchase_date', { ascending: false });
  if (error) {
    console.error('Error fetching purchases:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function adminUpdatePurchaseStatus(id, status) {
  const { data, error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: status,
      purchase_date: status === 'paid' ? new Date().toISOString() : undefined
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating purchase status:', error.message);
    throw new Error(error.message);
  }
  return data[0];
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
