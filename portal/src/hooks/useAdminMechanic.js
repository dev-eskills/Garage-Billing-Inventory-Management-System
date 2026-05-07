import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAddMechanic, deleteMechanic, fetchMechanics, updateMechanicDetails, updateMechanicPassword } from "../supabase/adminMechanic";
import toast from "react-hot-toast";

export const useAdminMechanic =()=>{
  const queryClient = useQueryClient();


  const getMechanicsFn = useQuery({
    queryKey: ['mechanics'],
    queryFn: fetchMechanics,
  }); 


  const adminAddMechanicFn = useMutation({
    mutationFn: adminAddMechanic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      toast.success('Mechanic account created successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const adminUpdateMechanicFn = useMutation({
    mutationFn: updateMechanicDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      toast.success('Mechanic updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const adminUpdateMechanicPasswordFn = useMutation({
    mutationFn: updateMechanicPassword,
    onSuccess: () => {
      toast.success('Mechanic password updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const adminDeleteMechanicFn = useMutation({
    mutationFn: deleteMechanic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      toast.success('Mechanic deleted successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });


  return {
    mechanics : getMechanicsFn.data,
    mechanicsPending : getMechanicsFn.isPending,
    mechanicsError : getMechanicsFn.error,

    adminAddMechanic: adminAddMechanicFn.mutateAsync,
    adminAddMechanicPending: adminAddMechanicFn.isPending,

    adminUpdateMechanic: adminUpdateMechanicFn.mutateAsync,
    adminUpdateMechanicPending: adminUpdateMechanicFn.isPending,
    
    adminUpdateMechanicPassword: adminUpdateMechanicPasswordFn.mutateAsync,
    adminUpdateMechanicPasswordPending: adminUpdateMechanicPasswordFn.isPending,

    adminDeleteMechanic: adminDeleteMechanicFn.mutateAsync,
    adminDeleteMechanicPending: adminDeleteMechanicFn.isPending,
  }
}