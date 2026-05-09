import { useQuery } from "@tanstack/react-query"
import { fetchAllInvoices, downloadInvoice } from "../supabase/invoices"

export const useInvoices= (jobId="")=>{
    const fetchAllInvoicesFn = useQuery({
        queryKey: ['invoices'],
        queryFn: fetchAllInvoices,
    })
    return {
        allInvoices : fetchAllInvoicesFn.data,
        allInvoicesPending : fetchAllInvoicesFn.isPending,
        allInvoicesError : fetchAllInvoicesFn.error, 
        downloadInvoice
    }
}