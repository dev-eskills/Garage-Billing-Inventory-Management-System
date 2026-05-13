
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, logout as logoutApi, getCurrentUser,updatePassword as updatePasswordApi} from '../supabase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth=()=>{
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginFn = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      toast.success('Successfully logged in!');
      navigate('/');
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
  }
}