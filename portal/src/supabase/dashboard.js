import { supabase } from '../lib/supabaseClient';

export async function fetchDashboardStats() {
  try {
    const [
      { count: partsCount },
      { count: purchasesCount },
      { data: purchasesData },
      { data: expensesData },
      { data: lossesData },
      { count: mechanicsCount },
      { count: customersCount },
      { count: jobsCount },
      { data: jobsData }
    ] = await Promise.all([
      supabase.from('parts').select('*', { count: 'exact', head: true }),
      supabase.from('purchases').select('*', { count: 'exact', head: true }),
      supabase.from('purchases').select('total_amount, payment_status'),
      supabase.from('expenses').select('amount'),
      supabase.from('losses').select('amount'),
      supabase.from('mechanics').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('total_amount_full_service, job_info')
    ]);

    const totalPurchasesAmount = purchasesData?.reduce((acc, p) => acc + (Number(p.total_amount) || 0), 0) || 0;
    const totalExpensesAmount = expensesData?.reduce((acc, e) => acc + (Number(e.amount) || 0), 0) || 0;
    const totalLossesAmount = lossesData?.reduce((acc, l) => acc + (Number(l.amount) || 0), 0) || 0;
    const totalRevenue = jobsData?.reduce((acc, j) => acc + (Number(j.total_amount_full_service) || 0), 0) || 0;

    // Profitability calculation (simplified: Revenue - Expenses - Purchases(paid) - Losses)
    // Note: This is a basic calculation, accounting can be more complex
    console.log(`totalRevenue ${totalRevenue}  totalLossesAmount ${totalLossesAmount} totalExpensesAmount 
      ${totalExpensesAmount}`) 
    // const profitability = totalRevenue - totalExpensesAmount - totalLossesAmount;
    const profitability = totalRevenue - totalExpensesAmount - totalLossesAmount - totalPurchasesAmount;

    return {
      parts: partsCount || 0,
      purchases: purchasesCount || 0,
      totalPurchasesAmount,
      expenses: totalExpensesAmount,
      losses: totalLossesAmount,
      mechanics: mechanicsCount || 0,
      customers: customersCount || 0,
      jobs: jobsCount || 0,
      revenue: totalRevenue,
      profitability,
      activeJobs: jobsData?.filter(j => 
        j.job_info?.status === 'pending' || 
        j.job_info?.status === 'unpaid' || 
        j.job_info?.status === 'ongoing'
      ).length || 0,
      completedJobs: jobsData?.filter(j => 
        j.job_info?.status === 'paid' || 
        j.job_info?.status === 'completed'
      ).length || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      parts: 0,
      purchases: 0,
      totalPurchasesAmount: 0,
      expenses: 0,
      losses: 0,
      mechanics: 0,
      customers: 0,
      jobs: 0,
      revenue: 0,
      profitability: 0,
      activeJobs: 0,
      completedJobs: 0,
    };
  }
}
