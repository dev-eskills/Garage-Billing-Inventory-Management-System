import { supabase } from "../lib/supabaseClient";

export async function recordMechanicInventory(inventoryData) {
  const { data, error } = await supabase
    .from('mechanic_inventory')
    .insert(inventoryData)
    .select();

  if (error) {
    console.error('Error recording mechanic inventory:', error.message);
    throw error;
  }
  return data;
}

export async function fetchMechanicInventory(mechanicId) {
  if (!mechanicId) return [];
  const { data, error } = await supabase
    .rpc('get_mechanic_aggregated_inventory', { target_mechanic_id: mechanicId });

  if (error) {
    console.error('Error fetching mechanic inventory:', error.message);
    throw error;
  }
  return data;
}

export async function updateMechanicStock({ mechanicId, partId, newQuantity }) {
  // 1. Get current total quantity
  const { data: currentRecords, error: fetchError } = await supabase
    .from('mechanic_inventory')
    .select('quantity, unit_price')
    .eq('mechanic_id', mechanicId)
    .eq('part_id', partId);

  if (fetchError) throw fetchError;

  const currentTotal = currentRecords?.reduce((acc, rec) => acc + (rec.quantity || 0), 0) || 0;
  const latestUnitPrice = currentRecords?.[currentRecords.length - 1]?.unit_price || 0;
  
  const difference = parseInt(newQuantity) - currentTotal;

  if (difference !== 0) {
    // 2. Insert adjustment record
    const { error: insertError } = await supabase
      .from('mechanic_inventory')
      .insert({
        mechanic_id: mechanicId,
        part_id: partId,
        quantity: difference,
        unit_price: latestUnitPrice,
        total_price: difference * latestUnitPrice,
        purchased_at: new Date().toISOString()
      });

    if (insertError) throw insertError;
  }
}



