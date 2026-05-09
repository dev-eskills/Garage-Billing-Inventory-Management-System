import { supabase } from "../lib/supabaseClient";

export const fetchAllInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      jobs (
        *,
        mechanic:profiles (
          full_name,
          role
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const downloadInvoice = async (path, name) => {
  const { data, error } = await supabase.storage
    .from('invoices')
    .download(path);

  if (error) {
    alert("Error downloading file: " + error.message);
    return;
  }

  // Create a temporary link to trigger the browser download
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = name || 'invoice.pdf';
  a.click();
  URL.revokeObjectURL(url);
};
