import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLosses, addLoss, updateLoss, deleteLoss } from '../supabase/losses';
import { toast } from 'react-hot-toast';

export function useLosses() {
  const queryClient = useQueryClient();

  const {
    data: losses,
    isLoading: lossesLoading,
    error,
  } = useQuery({
    queryKey: ['losses'],
    queryFn: fetchLosses,
  });

  const { mutate: createLoss, isLoading: createLossPending } = useMutation({
    mutationFn: addLoss,
    onSuccess: () => {
      queryClient.invalidateQueries(['losses']);
      queryClient.invalidateQueries(['dashboard-stats']);
      toast.success('Loss record added successfully');
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  const { mutate: editLoss, isLoading: updateLossPending } = useMutation({
    mutationFn: updateLoss,
    onSuccess: () => {
      queryClient.invalidateQueries(['losses']);
      queryClient.invalidateQueries(['dashboard-stats']);
      toast.success('Loss record updated successfully');
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  const { mutate: removeLoss, isLoading: deleteLossPending } = useMutation({
    mutationFn: deleteLoss,
    onSuccess: () => {
      queryClient.invalidateQueries(['losses']);
      queryClient.invalidateQueries(['dashboard-stats']);
      toast.success('Loss record deleted successfully');
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  return {
    losses,
    lossesLoading,
    error,
    createLoss,
    createLossPending,
    editLoss,
    updateLossPending,
    removeLoss,
    deleteLossPending,
  };
}
