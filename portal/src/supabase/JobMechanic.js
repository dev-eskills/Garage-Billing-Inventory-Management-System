import { supabase } from "../lib/supabaseClient";

// Fetch all jobs with optional vendor or mechanic info
export async function fetchJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:customers_id_fkey (*),      -- Join customer table
      mechanic:mechanics_id_fkey (*)       -- Join mechanic table
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log(data, "jobs data");
  return data;
}

// Fetch jobs by a specific mechanic
export async function fetchJobsByMechanic(mechanicId) {
  if (!mechanicId) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:customers_id_fkey (*)
    `,
    )
    .eq("mechanic_id", mechanicId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log(data, "jobs by mechanic");
  return data;
}

// Search jobs by job title or description
export async function searchJobs(searchTerm) {
  if (!searchTerm) {
    // If search empty, return all jobs
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .ilike("job_title", `%${searchTerm}%`) // case-insensitive search
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
