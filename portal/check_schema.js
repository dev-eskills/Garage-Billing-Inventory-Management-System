import { supabase } from './src/lib/supabaseClient.js';

async function checkSchema() {
  const { data: customer } = await supabase.from('customers').select('*').limit(1);
  console.log('Customer columns:', Object.keys(customer?.[0] || {}));
  
  const { data: invoice } = await supabase.from('invoices').select('*').limit(1);
  console.log('Invoice columns:', Object.keys(invoice?.[0] || {}));
}

checkSchema();
