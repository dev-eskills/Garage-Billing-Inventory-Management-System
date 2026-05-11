import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  fetchMechanicCustomers,
  updateCustomer,
  deleteCustomer,
  fetchCustomerById,
} from "../supabase/customers";
import { toast } from "react-hot-toast";

export const useCustomers = (mechanicId) => {
  const queryClient = useQueryClient();

  const mechanicCustomersQuery = useQuery({
    queryKey: ["mechanic-customers", mechanicId],
    queryFn: () => fetchMechanicCustomers(mechanicId),
    enabled: !!mechanicId,
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mechanic-customers"] });
      toast.success("Customer created successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mechanic-customers"] });
      toast.success("Customer updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error updating: ${error.message}`);
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mechanic-customers"] });
      toast.success("Customer deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Error deleting: ${error.message}`);
    },
  });

  const customerByIdQuery = (customerId) =>
    useQuery({
      queryKey: ["customer", customerId],
      queryFn: () => fetchCustomerById(customerId),
      enabled: !!customerId,
    });

  return {
    customers: mechanicCustomersQuery.data || [],
    customersLoading: mechanicCustomersQuery.isLoading,
    createCustomer: createCustomerMutation.mutateAsync,
    createCustomerPending: createCustomerMutation.isPending,
    updateCustomer: updateCustomerMutation.mutateAsync,
    updateCustomerPending: updateCustomerMutation.isPending,
    deleteCustomer: deleteCustomerMutation.mutateAsync,
    deleteCustomerPending: deleteCustomerMutation.isPending,

    getCustomerById: customerByIdQuery,
    isLoadingCustomerById: customerByIdQuery.isLoading,
  };
};
