import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchDashboardStatsbyId,
} from "../supabase/dashboard";
import { useAuth } from "./useAuth";

export function useDashboard() {
  const { user } = useAuth();
  console.log(user.id);
  const {
    data: stats,
    isLoading: statsLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  // User-specific dashboard stats
  const {
    data: userStats,
    isLoading: userStatsLoading,
    error: userStatsError,
    refetch: refetchUserStats,
  } = useQuery({
    queryKey: ["dashboard-user-stats", user?.id],

    queryFn: () => fetchDashboardStatsbyId(user.id),

    enabled: !!user?.id,
  });

  return {
    stats,
    statsLoading,
    error,
    refetch,

    // User
    userStats,
    userStatsLoading,
    userStatsError,
    refetchUserStats,
  };
}
