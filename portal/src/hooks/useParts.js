import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchParts, fetchPartsByVendor, addPart, updatePart, deletePart, updatePartSalePrice, decreasePartStock } from '../supabase/parts';
import { toast } from 'react-hot-toast';

export const useParts = () => {
  const queryClient = useQueryClient();

  const getPartsFn = useQuery({
    queryKey: ['parts'],
    queryFn: fetchParts,
  });

  const addPartFn = useMutation({
    mutationFn: addPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Part added successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const updatePartFn = useMutation({
    mutationFn: updatePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Part updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const deletePartFn = useMutation({
    mutationFn: deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Part deleted successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const updatePartSalePriceFn = useMutation({
    mutationFn: ({ id, sale_price }) => updatePartSalePrice(id, sale_price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Sale price updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  return {
    parts: getPartsFn.data,
    partsPending: getPartsFn.isPending,
    partsError: getPartsFn.error,

    addPart: addPartFn.mutateAsync,
    addPartPending: addPartFn.isPending,

    updatePart: updatePartFn.mutateAsync,
    updatePartPending: updatePartFn.isPending,

    deletePart: deletePartFn.mutateAsync,
    deletePartPending: deletePartFn.isPending,

    updatePartSalePrice: updatePartSalePriceFn.mutateAsync,
    updatePartSalePricePending: updatePartSalePriceFn.isPending,

    decreasePartStock: async (partId, quantity) => {
      try {
        const data = await decreasePartStock(partId, quantity);
        queryClient.invalidateQueries(['parts']);
        return data;
      } catch (error) {
        toast.error('Failed to update stock');
        throw error;
      }
    }
  };
};

export const usePartsByVendor = (vendorId) => {
  return useQuery({
    queryKey: ['parts', vendorId],
    queryFn: () => fetchPartsByVendor(vendorId),
    enabled: !!vendorId,
  });
};
