import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const useInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createInvoice = async (invoicePayload) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("invoices")
        .insert(invoicePayload)
        .select("*")
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err) {
      console.error("Failed to create invoice:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createInvoice,
  };
};
