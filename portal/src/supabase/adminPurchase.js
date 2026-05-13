import { supabase } from '../lib/supabaseClient';

export async function adminAddPurchase({ vendor_id, total_amount, purchase_date, payment_status, quantity, part_id, unit_price, image_url }) {
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
        part_id,
        unit_price,
        image_url
      }
    ])
    .select();

  if (purchaseError) {
    console.error('Error adding purchase:', purchaseError.message);
    throw new Error(purchaseError.message);
  }

  // Create an automatic expense record for this purchase
  try {
    let partsPurchaseCatId;
    
    // First, try to find the "Parts Purchase" category
    const { data: catData, error: catError } = await supabase
      .from('expense_categories')
      .select('id')
      .eq('name', 'Parts Purchase')
      .maybeSingle();
      
    if (catData) {
      partsPurchaseCatId = catData.id;
    } else {
      // Create it if it doesn't exist
      const { data: newCat, error: newCatError } = await supabase
        .from('expense_categories')
        .insert([{ name: 'Parts Purchase' }])
        .select()
        .single();
        
      if (!newCatError && newCat) {
        partsPurchaseCatId = newCat.id;
      }
    }

    if (partsPurchaseCatId) {
      const expenseData = {
        category_id: partsPurchaseCatId,
        amount: total_amount,
        expense_date: payment_status === 'Paid' ? new Date().toISOString() : purchase_date,
        description: `Automated expense for part purchase (Quantity: ${quantity})`,
        purchase_id: purchaseData[0].id
      };

      const { error: expenseError } = await supabase
        .from('expenses')
        .insert([expenseData]);

      if (expenseError) {
        console.error('Error recording expense:', expenseError.message);
      }
    }
  } catch (err) {
    console.error('Failed to create automated expense:', err);
  }

  // Update stock_quantity in parts table
  const { data: partData, error: partErr } = await supabase
    .from('parts')
    .select('stock_quantity')
    .eq('id', part_id)
    .single();

  if (!partErr && partData) {
    await supabase
      .from('parts')
      .update({ stock_quantity: (partData.stock_quantity || 0) + parseInt(quantity, 10) })
      .eq('id', part_id);
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
        sale_price,
        image_url
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
