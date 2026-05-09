import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, fetchJobs } from "../supabase/jobs";
import { toast } from "react-hot-toast";

export const useJobs = (mechanicId) => {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs', mechanicId],
    queryFn: () => fetchJobs(mechanicId),
    enabled: !!mechanicId,
  });

  const createJobMutation = useMutation({
    mutationFn: (jobData) => createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', mechanicId] });
      queryClient.invalidateQueries({ queryKey: ['mechanicInventory', mechanicId] });
      toast.success("Job created successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  return {
    jobs: jobsQuery.data || [],
    isJobsLoading: jobsQuery.isLoading,
    createJob: createJobMutation.mutateAsync,
    isCreatingJob: createJobMutation.isPending,
  };
};
