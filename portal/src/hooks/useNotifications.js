import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  fetchAdminNotifications, 
  fetchMechanicNotifications, 
  markNotificationAsRead,
  checkAndGenerateExpirations 
} from "../supabase/notifications"

export const useNotifications = (mechanicId = null) => {
    const queryClient = useQueryClient();

    const getAdminNotificationsFn = useQuery({
        queryKey: ["admin-notifications"],
        queryFn: async () => {
          // Trigger expiry check when admin fetches notifications
          try {
            await checkAndGenerateExpirations();
          } catch (e) {
            console.error("Expiry check failed", e);
          }
          return fetchAdminNotifications();
        },
        enabled: !mechanicId,
        refetchInterval: 60000, // Refetch every minute
    })

    const getMechanicNotificationsFn = useQuery({
        queryKey: ["mechanic-notifications", mechanicId],
        queryFn: () => fetchMechanicNotifications(mechanicId),
        enabled: !!mechanicId,
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