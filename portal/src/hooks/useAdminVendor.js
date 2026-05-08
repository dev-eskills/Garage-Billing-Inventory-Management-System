import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVendors, adminAddVendor, adminUpdateVendor, adminDeleteVendor, fetchAllVendorsWithParts } from "../supabase/adminVendors";
import toast from "react-hot-toast";

export const useAdminVendor = (vendorId) => {
  const queryClient = useQueryClient();

  const getVendorsFn = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
  });

  const getVendorWithPartsFn = useQuery({
    queryKey: ['vendorWithParts'],
    queryFn: () => fetchAllVendorsWithParts(),
  });

  const adminAddVendorFn = useMutation({
    mutationFn: adminAddVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorWithParts'] });
      toast.success('Vendor added successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const adminUpdateVendorFn = useMutation({
    mutationFn: ({ id, formData }) => adminUpdateVendor(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorWithParts'] });
      toast.success('Vendor updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const adminDeleteVendorFn = useMutation({
    mutationFn: adminDeleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorWithParts'] });
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

    vendorWithParts: getVendorWithPartsFn.data,
    vendorWithPartsPending: getVendorWithPartsFn.isPending,
    vendorWithPartsError: getVendorWithPartsFn.error,

    adminAddVendor: adminAddVendorFn.mutateAsync,
    adminAddVendorPending: adminAddVendorFn.isPending,

    adminUpdateVendor: adminUpdateVendorFn.mutateAsync,
    adminUpdateVendorPending: adminUpdateVendorFn.isPending,

    adminDeleteVendor: adminDeleteVendorFn.mutateAsync,
    adminDeleteVendorPending: adminDeleteVendorFn.isPending,
  };
};
