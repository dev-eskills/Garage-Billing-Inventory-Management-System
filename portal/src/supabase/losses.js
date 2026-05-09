import { supabase } from '../lib/supabaseClient';

export async function fetchLosses() {
  const { data, error } = await supabase
    .from('losses')
    .select('*')
    .order('loss_date', { ascending: false });

  if (error) {
    console.error('Error fetching losses:', error.message);
    throw error;
  }
  return data;
}

export async function addLoss(lossData) {
  const { data, error } = await supabase
    .from('losses')
    .insert([lossData])
    .select();

  if (error) {
    console.error('Error adding loss:', error.message);
    throw new Error(error.message);
  }
  return data[0];
}

export async function updateLoss({ id, lossData }) {
  const { data, error } = await supabase
    .from('losses')
    .update(lossData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteLoss(id) {
  const { error } = await supabase
    .from('losses')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
