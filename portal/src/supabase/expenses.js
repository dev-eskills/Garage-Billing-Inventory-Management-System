import { supabase } from '../lib/supabaseClient';

export async function fetchExpenseCategories() {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function addExpenseCategory(name) {
  const { data, error } = await supabase
    .from('expense_categories')
    .insert([{ name }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function fetchExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      expense_categories (
        id,
        name
      ),
      purchases:purchase_id (
        id,
        quantity,
        unit_price,
        total_amount,
        payment_status,
        vendors (name),
        parts (part_name, sku)
      )
    `)
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error.message);
    throw error;
  }
  return data;
}

export async function addExpense(expenseData) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expenseData])
    .select();

  if (error) {
    console.error('Error adding expense:', error.message);
    throw new Error(error.message);
  }
  return data[0];
}

export async function updateExpense({ id, expenseData }) {
  const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteExpense(id) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
