import { supabase } from '../lib/supabaseClient';

export async function fetchParts() {
  // If get_parts RPC exists, use it. Otherwise fallback to select if RLS allows reading.
  const { data, error } = await supabase.rpc('get_parts');
  
  if (error) {
    // Fallback if the user hasn't created the get_parts RPC
    const fallback = await supabase.from('parts').select('*').order('created_at', { ascending: false });
    if (fallback.error) throw fallback.error;
    return fallback.data;
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
  const { data, error } = await supabase.rpc('add_part', {
    p_name: partData.part_name,
    p_sku: partData.sku,
    p_category: partData.category,
    p_stock: parseInt(partData.stock_quantity, 10) || 0,
    p_price: parseFloat(partData.unit_price) || 0,
    p_min_stock: parseInt(partData.min_stock_level, 10) || 0,
    p_image_url: partData.image_url
  });

  if (error) {
    // Fallback if RPC doesn't exist but RLS allows insert
    const fallback = await supabase.from('parts').insert([partData]).select();
    if (fallback.error) throw new Error(fallback.error.message);
    return fallback.data[0];
  }
  return data;
}

export async function updatePart({ id, partData }) {
  const { data, error } = await supabase.rpc('update_part', {
    target_part_id: id,
    new_part_name: partData.part_name,
    new_sku: partData.sku,
    new_category: partData.category,
    new_stock_quantity: parseInt(partData.stock_quantity, 10) || 0,
    new_unit_price: parseFloat(partData.unit_price) || 0,
    new_min_stock_level: parseInt(partData.min_stock_level, 10) || 0,
    new_image_url: partData.image_url
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePart(id) {
  const { data, error } = await supabase.rpc('delete_part', {
    target_part_id: id
  });

  if (error) throw new Error(error.message);
  return data;
}
