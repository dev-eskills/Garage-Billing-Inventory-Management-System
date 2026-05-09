import { supabase } from "../lib/supabaseClient";

export async function createJob(jobData) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error.message);
    throw error;
  }
  return data;
}


export async function fetchJobs(mechanicId) {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (*)
    `)
    .eq('mechanic_id', mechanicId)
    .order('service_date', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error.message);
    throw error;
  }
  return data;
}
