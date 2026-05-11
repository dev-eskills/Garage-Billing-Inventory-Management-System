import { useQuery } from "@tanstack/react-query";
import { fetchAllInvoices, downloadInvoice, fetchAllCustomers } from "../supabase/invoices";
import { useAuth } from "./useAuth";

export const useInvoices = () => {
  const {user} = useAuth();
  const invoicesQuery = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchAllInvoices,
  });

  const customersQuery = useQuery({
    queryKey: ['allCustomers'],
    queryFn: fetchAllCustomers,
    enabled: !!user
  });

  return {
    allInvoices: invoicesQuery.data || [],
    allInvoicesPending: invoicesQuery.isPending,
    allInvoicesError: invoicesQuery.error,
    downloadInvoice,

    allCustomers: customersQuery.data || [],
    allCustomersPending: customersQuery.isPending,
    allCustomersError: customersQuery.error,

    refreshAll: () => {
      invoicesQuery.refetch();
      customersQuery.refetch();
    }
  };
};