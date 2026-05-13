import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  recordMechanicInventory,
  fetchMechanicInventory,
  updateMechanicStock,
  fetchInventoryUsage,
} from "../supabase/mechanicInventory";
import { toast } from "react-hot-toast";

export const useMechanicInventory = (mechanicId) => {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ["mechanicInventory", mechanicId],
    queryFn: () => fetchMechanicInventory(mechanicId),
    enabled: !!mechanicId,
  });

  const addPartMechanicInventoryFn = useMutation({
    mutationKey: ["mechanicInventory"],
    mutationFn: (data) => recordMechanicInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockHistory"] });
      queryClient.invalidateQueries({ queryKey: ["currentStock"] });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({
        queryKey: ["mechanicInventory", mechanicId],
      });
    },
  });

  const updateMechanicStockFn = useMutation({
    mutationFn: updateMechanicStock,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mechanicInventory", mechanicId],
      });
      toast.success("Inventory updated successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const PartsUsageFn = useQuery({
    queryKey: ["partsUsage", mechanicId],
    queryFn: () => fetchInventoryUsage(mechanicId),
    enabled: !!mechanicId,
  });

  return {
    mechanicInventory: inventoryQuery.data || [],
    isInventoryPending: inventoryQuery.isPending,
    inventoryError: inventoryQuery.error,

    addPartMechanicInventory: addPartMechanicInventoryFn.mutateAsync,
    addPartMechanicInventoryIsPending: addPartMechanicInventoryFn.isPending,

    updateMechanicStock: updateMechanicStockFn.mutateAsync,
    updateMechanicStockIsPending: updateMechanicStockFn.isPending,

    MechanicPartsUsage: PartsUsageFn.data ?? [],
  };
};
