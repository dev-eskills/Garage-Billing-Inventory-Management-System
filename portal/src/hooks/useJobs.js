import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, fetchJobDetails, fetchJobs, updateJobParts } from "../supabase/jobs";
import { toast } from "react-hot-toast";

export const useJobs = (mechanicId, jobId = null) => {
  const queryClient = useQueryClient();
  const jobsQuery = useQuery({
    queryKey: ["jobs", mechanicId],
    queryFn: () => fetchJobs(mechanicId),
    enabled: !!mechanicId,
  });

  // Fetch single job details
  const jobDetailsQuery = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5, // 5 minutes stale
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
  });

  const createJobMutation = useMutation({
    mutationFn: (jobData) => createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", mechanicId] });
      queryClient.invalidateQueries({
        queryKey: ["mechanicInventory", mechanicId],
      });
      toast.success("Job created successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

   // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ jobId, updateData }) => updateJobParts(jobId, updateData),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["jobs", mechanicId] });
      queryClient.invalidateQueries({ queryKey: ["jobDetails", jobId] });
      toast.success("Job updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    jobs: jobsQuery.data || [],
    isJobsLoading: jobsQuery.isLoading,

    // Single job details
    jobDetails: jobDetailsQuery.data || null,
    isJobDetailsLoading: jobDetailsQuery.isLoading,

    createJob: createJobMutation.mutateAsync,
    isCreatingJob: createJobMutation.isPending,

    updateJob: updateJobMutation.mutateAsync,
    isUpdatingJob: updateJobMutation.isPending,
  };
};
