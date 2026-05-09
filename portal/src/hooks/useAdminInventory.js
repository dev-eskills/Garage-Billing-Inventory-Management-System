import { useQuery } from "@tanstack/react-query";
import { fetchStockHistory, fetchCurrentStock } from "../supabase/adminInventory";

export const useAdminInventory = () => {
  const stockHistoryQuery = useQuery({
    queryKey: ['stockHistory'],
    queryFn: fetchStockHistory,
  });

  const currentStockQuery = useQuery({
    queryKey: ['currentStock'],
    queryFn: fetchCurrentStock,
  });

  return {
    stockIn: stockHistoryQuery.data?.stockIn || [],
    stockOut: stockHistoryQuery.data?.stockOut || [],
    historyLoading: stockHistoryQuery.isLoading,
    
    currentStock: currentStockQuery.data || [],
    stockLoading: currentStockQuery.isLoading,
    
    refreshHistory: stockHistoryQuery.refetch,
    refreshStock: currentStockQuery.refetch
  };
};
