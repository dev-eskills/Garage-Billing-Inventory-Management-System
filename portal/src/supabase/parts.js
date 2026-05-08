import { supabase } from '../lib/supabaseClient';

export async function fetchParts() {
  const { data, error } = await supabase
    .from('parts')
    .select(`
      *,
      vendors!fk_parts_vendor (*) 
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
      vendors!fk_parts_vendor (*)
    `)
    .eq('vendor_id', vendorId)
    .order('part_name', { ascending: true });

  if (error) {
    console.error('Error fetching parts by vendor:', error.message);
    throw error;
  }
  console.log(data , "data ")
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
    stock_quantity: parseInt(partData.stock_quantity, 10) || 0,
    unit_price: parseFloat(partData.unit_price) || 0,
    min_stock_level: parseInt(partData.min_stock_level, 10) || 0,
    image_url: partData.image_url,
    vendor_id: partData.vendor_id
  };

  console.log(insertData);
  const { data, error } = await supabase
    .from('parts')
    .insert([insertData])
    .select(`
      *,
      vendors!fk_parts_vendor (*)
    `);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function updatePart({ id, partData }) {
  const updateData = {
    part_name: partData.part_name,
    sku: partData.sku,
    category: partData.category,
    stock_quantity: parseInt(partData.stock_quantity, 10) || 0,
    unit_price: parseFloat(partData.unit_price) || 0,
    min_stock_level: parseInt(partData.min_stock_level, 10) || 0,
    image_url: partData.image_url,
    vendor_id: partData.vendor_id
  };

  const { data, error } = await supabase
    .from('parts')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      vendors!fk_parts_vendor (*)
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
