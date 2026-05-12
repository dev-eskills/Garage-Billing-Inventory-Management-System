// import { useQuery } from "@tanstack/react-query";
// import { fetchAllInvoices, downloadInvoice } from "../supabase/invoices";

// export const useInvoices = (jobId = "") => {
//   const fetchAllInvoicesFn = useQuery({
//     queryKey: ["invoices"],
//     queryFn: fetchAllInvoices,
//   });
//   return {
//     allInvoices: fetchAllInvoicesFn.data,
//     allInvoicesPending: fetchAllInvoicesFn.isPending,
//     allInvoicesError: fetchAllInvoicesFn.error,
//     downloadInvoice,
//   };
// };

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAllInvoices,
  fetchInvoiceById,
  downloadInvoice,
  fetchInvoiceByJobId,
} from "../supabase/invoices";

export const useInvoices = ({
  mechanicId,
  page = 1,
  limit = 10,
  search = "",
  invoiceId,
} = {}) => {
  // --- Query for all invoices ---
  const invoicesQuery = useQuery({
    queryKey: ["invoices", mechanicId, page, limit, search],
    queryFn: () => fetchAllInvoices({ mechanicId, page, limit, search }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  // --- Query for a single invoice ---
  const invoiceQuery = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceById(invoiceId),
    enabled: !!invoiceId, // only fetch if invoiceId exists
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  return {
    // --- All invoices ---
    invoices: invoicesQuery.data?.data || [],
    total: invoicesQuery.data?.total || 0,
    invoicesLoading: invoicesQuery.isLoading,
    invoicesError: invoicesQuery.error,

    // --- Single invoice ---
    invoice: invoiceQuery.data || null,
    invoiceLoading: invoiceQuery.isLoading,
    invoiceError: invoiceQuery.error,

    downloadInvoice,
  };
};
