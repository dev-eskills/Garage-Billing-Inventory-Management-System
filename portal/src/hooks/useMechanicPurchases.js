import { useQuery } from "@tanstack/react-query";
import { fetchAllMechanicInventory } from "../supabase/mechanicInventory";

export function useMechanicPurchases(mechanicId) {
  const {
    data: purchases = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mechanicPurchases", mechanicId],
    queryFn: () => fetchAllMechanicInventory(mechanicId),
    enabled: !!mechanicId,
  });

  return {
    purchases,
    isLoading,
    error,
    refetch,
  };
}
