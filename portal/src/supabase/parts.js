import { supabase } from '../lib/supabaseClient';

export async function fetchParts() {
  const { data, error } = await supabase
    .from('parts')
    .select(`
      *,
      vendors (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchPartsByVendor(vendorId) {
  if (!vendorId) return [];
  const { data, error } = await supabase
    .from('parts')
    .select(`
      *,
      vendors (*)
    `)
    .eq('vendor_id', vendorId)
    .order('part_name', { ascending: true });

  if (error) {
    console.error('Error fetching parts by vendor:', error.message);
    throw error;
  }
  return data;
}

export async function uploadPartImage(file) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('part-images')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Image upload failed: ' + uploadError.message);
  }

  const { data } = supabase.storage
    .from('part-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function addPart(partData) {
  const insertData = {
    part_name: partData.part_name,
    sku: partData.sku,
    category: partData.category,
    image_url: partData.image_url
  };

  console.log(insertData);
  const { data, error } = await supabase
    .from('parts')
    .insert([insertData])
    .select(`
      *,
      vendors (*)
    `);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function updatePart({ id, partData }) {
  const updateData = {
    part_name: partData.part_name,
    sku: partData.sku,
    category: partData.category,
    image_url: partData.image_url
  };

  const { data, error } = await supabase
    .from('parts')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      vendors (*)
    `);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deletePart(id) {
  const { data, error } = await supabase.rpc('delete_part', {
    target_part_id: id
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function updatePartSalePrice(id, sale_price) {
  const { data, error } = await supabase
    .from('parts')
    .update({ sale_price: parseFloat(sale_price) || 0 })
    .eq('id', id)
    .select(`
      *,
      vendors (*)
    `);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function decreasePartStock(partId, quantity) {
  const { data: partData, error: fetchError } = await supabase
    .from('parts')
    .select('stock_quantity')
    .eq('id', partId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('parts')
    .update({ stock_quantity: Math.max(0, (partData.stock_quantity || 0) - parseInt(quantity, 10)) })
    .eq('id', partId)
    .select();

  if (error) throw error;
  return data[0];
}

