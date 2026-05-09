import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminAddPurchase, adminFetchPurchases, adminUpdatePurchaseStatus, adminDeletePurchase } from '../supabase/adminPurchase';

export const useAdminPurchase = () => {
  const queryClient = useQueryClient();

  const getpurchaseFn = useQuery({
    queryKey: ['adminPurchases'],
    queryFn: adminFetchPurchases,
  });

  const addPurchaseFn = useMutation({
    mutationFn: adminAddPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPurchases']);
      queryClient.invalidateQueries(['stockIn']);
      queryClient.invalidateQueries(['currentStock']);
      toast.success('Purchase recorded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to record purchase');
    },
  });

  const updatePurchaseStatusFn = useMutation({
    mutationFn: ({ id, status }) => adminUpdatePurchaseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPurchases']);
      queryClient.invalidateQueries(['stockIn']);
      toast.success('Payment status updated!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const deletePurchaseFn = useMutation({
    mutationFn: adminDeletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPurchases']);
      queryClient.invalidateQueries(['stockIn']);
      queryClient.invalidateQueries(['currentStock']);
      toast.success('Purchase record deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete record');
    },
  });

  return {
    purchases :getpurchaseFn.data,
    purchasesPending : getpurchaseFn.isPending,
    purchasesError:getpurchaseFn.error,

    addPurchase: addPurchaseFn.mutateAsync,
    addPurchasePending: addPurchaseFn.isPending,
    addPurchaseError: addPurchaseFn.error,

    updatePurchaseStatus: updatePurchaseStatusFn.mutateAsync,
    updateStatusPending: updatePurchaseStatusFn.isPending,
    updateStatusError: updatePurchaseStatusFn.error,
    
    deletePurchase: deletePurchaseFn.mutateAsync,
    deletePurchasePending: deletePurchaseFn.isPending,
    deletePurchaseError: deletePurchaseFn.error,
  };
};
