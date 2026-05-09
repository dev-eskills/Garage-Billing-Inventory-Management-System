import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchAdminNotifications, markNotificationAsRead } from "../supabase/notifications"

export const useNotifications = ()=>{
    const queryClient = useQueryClient();

    const getAdminNotificationsFn = useQuery({
        queryKey: ["admin-notifications"],
        queryFn: fetchAdminNotifications,
    })

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
        }
    })

    return{
       adminNotifications: getAdminNotificationsFn.data,
       isLoading: getAdminNotificationsFn.isLoading,
       isError: getAdminNotificationsFn.isError,
       markAsRead: markAsReadMutation.mutateAsync,
    }
}