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

    const purchaseIdMap = new Map();
    const amountDateMap = new Map();

    (existingExpenses || []).forEach(e => {
      if (e.purchase_id) {
        purchaseIdMap.set(e.purchase_id, e);
      } else {
        const key = `${Number(e.amount)}-${new Date(e.expense_date).toISOString().split('T')[0]}`;
        // For amount-date, we might have multiple, so let's store them in an array
        if (!amountDateMap.has(key)) amountDateMap.set(key, []);
        amountDateMap.get(key).push(e);
      }
    });

    let syncCount = 0;
    
    for (const pur of purchases) {
      // 1. Check if this specific purchase is already synced via purchase_id
      if (purchaseIdMap.has(pur.id)) continue;

      const purDate = new Date(pur.purchase_date || pur.created_at).toISOString().split('T')[0];
      const key = `${Number(pur.total_amount)}-${purDate}`;
      
      // 2. Check if there's an unlinked expense with the same amount and date
      const candidates = amountDateMap.get(key);
      if (candidates && candidates.length > 0) {
        // Link the first available unlinked expense
        const existingRow = candidates.shift();
        await supabase.from('expenses')
          .update({ purchase_id: pur.id })
          .eq('id', existingRow.id);
        syncCount++;
        purchaseIdMap.set(pur.id, existingRow);
      } else {
        // 3. No match found at all, insert a new expense
        await supabase.from('expenses').insert([{
          category_id: partsPurchaseCatId,
          amount: pur.total_amount,
          expense_date: pur.purchase_date || pur.created_at,
          description: `Historical automated expense (Quantity: ${pur.quantity})`,
          purchase_id: pur.id
        }]);
        syncCount++;
        purchaseIdMap.set(pur.id, { id: 'new' });
      }
    }

    toast.success(`Successfully synced ${syncCount} historical purchase(s)!`, { id: 'sync' });
    return true;
  } catch (error) {
    console.error('Sync Error:', error);
    toast.error('Failed to sync historical data', { id: 'sync' });
  }
}
