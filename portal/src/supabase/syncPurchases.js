import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export async function syncHistoricalPurchases() {
  try {
    toast.loading('Syncing historical purchases...', { id: 'sync' });
    
    // 1. Get the Parts Purchase category ID
    let partsPurchaseCatId;
    const { data: catData } = await supabase
      .from('expense_categories')
      .select('id')
      .eq('name', 'Parts Purchase')
      .maybeSingle();
      
    if (catData) {
      partsPurchaseCatId = catData.id;
    } else {
      const { data: newCat } = await supabase
        .from('expense_categories')
        .insert([{ name: 'Parts Purchase' }])
        .select()
        .single();
      if (newCat) partsPurchaseCatId = newCat.id;
    }

    if (!partsPurchaseCatId) throw new Error('Could not resolve category ID');

    // 2. Fetch all purchases
    const { data: purchases } = await supabase.from('purchases').select('*');
    if (!purchases || purchases.length === 0) {
      toast.success('No purchases found to sync.', { id: 'sync' });
      return;
    }

    // 3. Fetch all current expenses linked to parts purchase
    const { data: existingExpenses } = await supabase
      .from('expenses')
      .select('id, description, amount, expense_date, purchase_id')
      .eq('category_id', partsPurchaseCatId);

    const existingMap = new Map();
    (existingExpenses || []).forEach(e => {
      const key = `${e.amount}-${new Date(e.expense_date).toISOString().split('T')[0]}`;
      existingMap.set(key, e);
    });

    let syncCount = 0;
    
    for (const pur of purchases) {
      const purDate = new Date(pur.purchase_date || pur.created_at).toISOString().split('T')[0];
      const key = `${pur.total_amount}-${purDate}`;
      
      // If we don't have an exact match in expenses for this amount and date, insert it
      if (!existingMap.has(key)) {
        await supabase.from('expenses').insert([{
          category_id: partsPurchaseCatId,
          amount: pur.total_amount,
          expense_date: pur.purchase_date || pur.created_at,
          description: `Historical automated expense (Quantity: ${pur.quantity})`,
          purchase_id: pur.id
        }]);
        syncCount++;
        existingMap.set(key, { amount: pur.total_amount }); // prevent duplicates in loop
      } else {
        // If it exists but has no reference_id, patch it
        const existingRow = existingMap.get(key);
        if (existingRow && existingRow.id && !existingRow.purchase_id) {
          await supabase.from('expenses')
            .update({ purchase_id: pur.id })
            .eq('id', existingRow.id);
          syncCount++;
        }
      }
    }

    toast.success(`Successfully synced ${syncCount} historical purchase(s)!`, { id: 'sync' });
    return true;
  } catch (error) {
    console.error('Sync Error:', error);
    toast.error('Failed to sync historical data', { id: 'sync' });
  }
}
