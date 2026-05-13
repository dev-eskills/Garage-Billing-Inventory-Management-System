import { supabase } from '../lib/supabaseClient';
import { fetchMechanics } from './adminMechanic';

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
  try {
    // 1. Fetch mechanics first
    const mechanics = await fetchMechanics();

    // 2. Fetch inventory
    const { data: inventory, error } = await supabase
      .from('mechanic_inventory')
      .select(`
        *,
        parts (
          part_name, 
          sku, 
          image_url,
          sale_price
        )
      `)
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error("Error fetching mechanic inventory:", error);
      return [];
    }

    // 3. Check if inventory is null or empty
    if (!inventory || inventory.length === 0) return [];

    // CORRECTED LOG: inventory is already the array
    console.log("Stock Out Inventory Data:", inventory);

    // 4. Join mechanics data manually
    return inventory.map(item => {
      // Ensure the IDs are compared as the same type (strings/UUIDs)
      const mechanic = mechanics.find(m => m.id === item.mechanic_id);

      return {
        ...item,
        // Using "profiles" to match your previous UI expectation
        profiles: mechanic ? {
          full_name: mechanic.full_name || mechanic.name || 'Unknown Mechanic',
          email: mechanic.email,
          phone: mechanic.phone || mechanic.contact
        } : null
      };
    });
  } catch (err) {
    console.error("fetchStockOut failed:", err);
    return [];
  }
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

export async function assignPartsToMechanic({ mechanic_id, parts }) {
  // parts should be an array of { part_id, quantity, total_price }
  
  const results = [];
  
  for (const part of parts) {
    // 1. Get current stock
    const { data: partData, error: fetchError } = await supabase
      .from('parts')
      .select('stock_quantity')
      .eq('id', part.part_id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // 2. Update stock_quantity
    const { error: updateError } = await supabase
      .from('parts')
      .update({ stock_quantity: Math.max(0, (partData.stock_quantity || 0) - part.quantity) })
      .eq('id', part.part_id);
      
    if (updateError) throw updateError;
    
    // 3. Insert into mechanic_inventory
    const { data: inventoryData, error: insertError } = await supabase
      .from('mechanic_inventory')
      .insert([{
        mechanic_id,
        part_id: part.part_id,
        quantity: part.quantity,
        unit_price: part.total_price / part.quantity,
        total_price: part.total_price,
        purchased_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (insertError) throw insertError;
    results.push(inventoryData);
  }
  
  return results;
}
