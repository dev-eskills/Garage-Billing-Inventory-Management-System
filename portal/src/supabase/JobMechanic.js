import { supabase } from "../lib/supabaseClient";

export async function addJob(jobData) {
  try {
    // Ensure required fields exist
    const payload = {
      customer_id: jobData.customer_id,
      mechanic_id: jobData.mechanic_id,
      service_date:
        jobData.service_date || new Date().toISOString().slice(0, 10),
      job_info: jobData.job_info || {
        status: "pending",
        repair_issue: "",
        service_type: "",
      },
      parts_items: jobData.parts_items || [],
      extra_service: jobData.extra_service || { amount: 0, description: "" },
      discount_percentage: jobData.discount_percentage || 0,
      total_amount_full_service: jobData.total_amount_full_service || 0,
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert([payload])
      .select();

    if (error) throw error;

    console.log("Job added:", data);
    return data[0];
  } catch (err) {
    console.error("Error adding job:", err);
    return null;
  }
}

// export async function addJob(jobData) {
//   try {
//     const { data, error } = await supabase
//       .from("jobs")
//       .insert([jobData])
//       .select("*"); // returns the inserted row

//     if (error) throw error;

//     console.log("Job added:", data);
//     return data[0]; // return the single inserted job
//   } catch (err) {
//     console.error("Error adding job:", err);
//     return null;
//   }
// }

// Fetch all jobs with optional vendor or mechanic info
export async function fetchJobs() {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
        *,
        customer:customer_id(id, customer_details, vehicle_details)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    console.log("Jobs fetched with customer & mechanic:", data);
    return data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
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
