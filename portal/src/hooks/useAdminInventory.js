import { useQuery } from "@tanstack/react-query";
import { fetchStockIn, fetchStockOut, fetchCurrentStock } from "../supabase/adminInventory";

export const useAdminInventory = () => {
  const stockInQuery = useQuery({
    queryKey: ['stockIn'],
    queryFn: fetchStockIn,
  });

  const stockOutQuery = useQuery({
    queryKey: ['stockOut'],
    queryFn: fetchStockOut,
  });

  const currentStockQuery = useQuery({
    queryKey: ['currentStock'],
    queryFn: fetchCurrentStock,
  });

  return {
    stockIn: stockInQuery.data || [],
    stockOut: stockOutQuery.data || [],
    stockInLoading: stockInQuery.isLoading,
    stockOutLoading: stockOutQuery.isLoading,
    
    currentStock: currentStockQuery.data || [],
    stockLoading: currentStockQuery.isLoading,
    
    refreshAll: () => {
      stockInQuery.refetch();
      stockOutQuery.refetch();
      currentStockQuery.refetch();
    }
  };
};
