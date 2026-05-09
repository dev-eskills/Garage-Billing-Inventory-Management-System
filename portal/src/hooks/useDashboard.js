import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../supabase/dashboard';

export function useDashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  return {
    stats,
    statsLoading,
    error,
    refetch
  };
}
