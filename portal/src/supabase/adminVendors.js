import { supabase } from '../lib/supabaseClient';

export async function fetchVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendors:', error.message);
    throw error;
  }
  return data;
}

export async function fetchAllVendorsWithParts() {
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      *,
      purchases (
        quantity,
        total_amount,
        unit_price,
        purchase_date,
        parts (
          part_name
        )
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors with parts:', error.message);
    throw error;
  }

  // Transform data to group parts from purchases
  return data.map(vendor => {
    const partsMap = {};

    vendor.purchases?.forEach(purchase => {
      const partName = purchase.parts?.part_name;
      if (partName) {
        if (!partsMap[partName]) {
          partsMap[partName] = 0;
        }
        partsMap[partName] += purchase.quantity || 0;
      }
    });

    const transformedParts = Object.keys(partsMap).map(name => ({
      part_name: name,
      stock_quantity: partsMap[name] // Reusing stock_quantity key for UI compatibility
    }));

    return {
      ...vendor,
      parts: transformedParts,
      purchaseHistory: vendor.purchases || []
    };
  });
}

export async function adminAddVendor({ name, email, phone, address }) {
  const { data, error } = await supabase
    .from('vendors')
    .insert([
      {
        name: name,
        email: email,
        phone: phone,
        address: address
      }
    ])
    .select();

  if (error) {
    console.error('Error adding vendor:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function adminUpdateVendor(id, { name, email, phone, address }) {

  const { data, error } = await supabase
    .from('vendors')
    .update({
      name: name,
      email: email,
      phone: phone,
      address: address
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating vendor:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function adminDeleteVendor(id) {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vendor:', error.message);
    throw new Error(error.message);
  }
  return true;
}
