import { supabase } from "../lib/supabaseClient";

export async function createJob(jobData) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(jobData)
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error.message);
    throw error;
  }
  return data;
}

export async function fetchJobs(mechanicId) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customers (*)
    `,
    )
    .eq("mechanic_id", mechanicId)
    .order("service_date", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error.message);
    throw error;
  }
  return data;
}

export async function fetchJobDetails(jobId) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customers (*)
    `,
    )
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching job details:", error.message);
    throw error;
  }
  return data;
}

export async function markJobComplete(job) {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      job_info: {
        ...job.job_info,
        status: "completed",
      },
    })
    .eq("id", job.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating job:", error.message);
    throw error;
  }

  return data;
}

export async function updateJobParts(jobId, updateData) {
  const parts = updateData.parts_items;

  // ✅ safety check (THIS FIXES YOUR ERROR)
  if (!Array.isArray(parts)) {
    throw new Error("parts_items must be an array");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({
      ...updateData,
      parts_items: parts,
    })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    console.error("Error updating job parts:", error.message);
    throw error;
  }

  return data;
}
