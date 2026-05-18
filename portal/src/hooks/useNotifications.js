import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  fetchAdminNotifications, 
  fetchMechanicNotifications, 
  markNotificationAsRead,
  checkAndGenerateExpirations 
} from "../supabase/notifications"
import { useAuth } from "./useAuth"

export const useNotifications = (isMechanic = false) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const getAdminNotificationsFn = useQuery({
        queryKey: ["admin-notifications", userId],
        queryFn: async () => {
          if (!userId) return [];
          // Trigger expiry check when admin fetches notifications
          try {
            await checkAndGenerateExpirations();
          } catch (e) {
            console.error("Expiry check failed", e);
          }
          return fetchAdminNotifications(userId);
        },
        enabled: !!userId && !isMechanic,
        refetchInterval: 60000, 
    })

    const getMechanicNotificationsFn = useQuery({
        queryKey: ["mechanic-notifications", userId],
        queryFn: async () => {
          if (!userId) return [];
          // Trigger expiry check when mechanic fetches notifications too
          try {
            await checkAndGenerateExpirations();
          } catch (e) {
            console.error("Expiry check failed", e);
          }
          return fetchMechanicNotifications(userId);
        },
        enabled: !!userId && isMechanic,
        refetchInterval: 60000,
    })

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["mechanic-notifications"] });
        }
    })

    return {
       adminNotifications: getAdminNotificationsFn.data,
       mechanicNotifications: getMechanicNotificationsFn.data,
       isLoading: getAdminNotificationsFn.isLoading || getMechanicNotificationsFn.isLoading,
       isError: getAdminNotificationsFn.isError || getMechanicNotificationsFn.isError,
       markAsRead: markAsReadMutation.mutateAsync,
    }
}