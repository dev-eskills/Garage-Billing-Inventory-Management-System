import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, addExpense, updateExpense, deleteExpense, fetchExpenseCategories, addExpenseCategory } from '../supabase/expenses';
import { toast } from 'react-hot-toast';

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const getExpensesFn = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const getCategoriesFn = useQuery({
    queryKey: ['expense_categories'],
    queryFn: fetchExpenseCategories,
  });

  const addCategoryFn = useMutation({
    mutationFn: addExpenseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_categories'] });
      toast.success('Category added successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const addExpenseFn = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const updateExpenseFn = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  const deleteExpenseFn = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully!');
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error(err.message);
    },
  });

  return {
    expenses: getExpensesFn.data || [],
    expensesPending: getExpensesFn.isPending,
    expensesError: getExpensesFn.error,

    addExpense: addExpenseFn.mutateAsync,
    addExpensePending: addExpenseFn.isPending,

    updateExpense: updateExpenseFn.mutateAsync,
    updateExpensePending: updateExpenseFn.isPending,

    deleteExpense: deleteExpenseFn.mutateAsync,
    deleteExpensePending: deleteExpenseFn.isPending,

    categories: getCategoriesFn.data || [],
    categoriesPending: getCategoriesFn.isPending,
    addCategory: addCategoryFn.mutateAsync,
    addCategoryPending: addCategoryFn.isPending,
  };
};
