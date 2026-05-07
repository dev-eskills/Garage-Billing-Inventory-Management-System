import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchVendors, addVendor, updateVendor, deleteVendor } from '../supabase/vendors';
import { toast } from 'react-hot-toast';

export const useVendors = () => {
  const queryClient = useQueryClient();

  const getVendorsFn = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
  });

  const addVendorFn = useMutation({
    mutationFn: addVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor added successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const updateVendorFn = useMutation({
    mutationFn: updateVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const deleteVendorFn = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  return {
    vendors: getVendorsFn.data,
    vendorsPending: getVendorsFn.isPending,
    vendorsError: getVendorsFn.error,

    addVendor: addVendorFn.mutateAsync,
    addVendorPending: addVendorFn.isPending,

    updateVendor: updateVendorFn.mutateAsync,
    updateVendorPending: updateVendorFn.isPending,

    deleteVendor: deleteVendorFn.mutateAsync,
    deleteVendorPending: deleteVendorFn.isPending,
  };
};
