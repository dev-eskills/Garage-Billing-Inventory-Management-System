
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  adminAddMechanic as adminAddMechanicApi, updateMechanicDetails , login as loginApi, logout as logoutApi, getCurrentUser,updatePassword as updatePasswordApi, fetchMechanics } from '../supabase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth=()=>{
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  const adminAddMechanicFn = useMutation({
    mutationFn: adminAddMechanicApi,
    onSuccess: () => {
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

  const loginFn = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const logoutFn = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate('/login', { replace: true });
      toast.success('Successfully logged out');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });


  const updatePasswordFn = useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success('Password updated successfully!');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const getUserFn = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  const getMechanicsFn = useQuery({
    queryKey: ['mechanics'],
    queryFn: fetchMechanics,
  });

  return {
    
    login :loginFn.mutateAsync,
    loginPending : loginFn.isPending,
    loginError : loginFn.error,

    user : getUserFn.data,
    userPending : getUserFn.isPending,
    userError : getUserFn.error,
    isAuthenticated: getUserFn?.data?.role === 'authenticated' ,

    logout :logoutFn.mutateAsync,
    logoutPending : logoutFn.isPending,
    logoutError : logoutFn.error,

    updatePassword: updatePasswordFn.mutateAsync,
    updatePasswordPending: updatePasswordFn.isPending,

    mechanics : getMechanicsFn.data,
    mechanicsPending : getMechanicsFn.isPending,
    mechanicsError : getMechanicsFn.error,

    adminAddMechanic: adminAddMechanicFn.mutateAsync,
    adminAddMechanicPending: adminAddMechanicFn.isPending,

    adminUpdateMechanic: adminUpdateMechanicFn.mutateAsync,
    adminUpdateMechanicPending: adminUpdateMechanicFn.isPending,
  }
}