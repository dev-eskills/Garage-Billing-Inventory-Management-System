import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchParts, addPart, updatePart, deletePart } from '../supabase/parts';
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
  };
};
