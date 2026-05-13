import { supabase } from "../lib/supabaseClient";

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
      { count: invoicesCount },
      { data: invoicesData },
    ] = await Promise.all([
      supabase.from("parts").select("*", { count: "exact", head: true }),
      supabase.from("purchases").select("*", { count: "exact", head: true }),
      supabase.from("purchases").select("total_amount, payment_status"),
      supabase.from("expenses").select("amount"),
      supabase.from("losses").select("amount"),
      supabase.from("profile").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("invoices").select("*", { count: "exact", head: true }),
      supabase.from("invoices").select("total_amount, status"),
    ]);

    const totalPurchasesAmount =
      purchasesData?.reduce(
        (acc, p) => acc + (Number(p.total_amount) || 0),
        0,
      ) || 0;
    const totalExpensesAmount =
      expensesData?.reduce((acc, e) => acc + (Number(e.amount) || 0), 0) || 0;
    const totalLossesAmount =
      lossesData?.reduce((acc, l) => acc + (Number(l.amount) || 0), 0) || 0;
    const totalRevenue =
      invoicesData?.reduce(
        (acc, i) => acc + (Number(i.total_amount) || 0),
        0,
      ) || 0;

    // Profitability calculation (simplified: Revenue - Expenses - Purchases(paid) - Losses)
    // Note: This is a basic calculation, accounting can be more complex
    const profitability =
      totalRevenue - totalExpensesAmount - totalLossesAmount;

    return {
      parts: partsCount || 0,
      purchases: purchasesCount || 0,
      totalPurchasesAmount,
      expenses: totalExpensesAmount,
      losses: totalLossesAmount,
      mechanics: mechanicsCount || 0,
      customers: customersCount || 0,
      invoices: invoicesCount || 0,
      revenue: totalRevenue,
      profitability,
      activeJobs:
        invoicesData?.filter(
          (i) => i.status === "pending" || i.status === "unpaid",
        ).length || 0,
      completedJobs:
        invoicesData?.filter((i) => i.status === "paid").length || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      parts: 0,
      purchases: 0,
      totalPurchasesAmount: 0,
      expenses: 0,
      losses: 0,
      mechanics: 0,
      customers: 0,
      invoices: 0,
      revenue: 0,
      profitability: 0,
      activeJobs: 0,
      completedJobs: 0,
    };
  }
}

// export async function fetchDashboardStatsbyId(userId) {
//   console.log("USER ID:", userId);

//   try {
//     const [inventoryRes, customersRes, invoicesRes, jobsRes] =
//       await Promise.all([
//         // Inventory (count + total value)
//         supabase
//           .from("mechanic_inventory")
//           .select("total_price", { count: "exact" })
//           .eq("mechanic_id", userId),

//         // Customers count
//         supabase
//           .from("customers")
//           .select("*", { count: "exact", head: true })
//           .eq("mechanic_id", userId),

//         // Invoices count (created by user)
//         supabase
//           .from("invoices")
//           .select("*", { count: "exact", head: true })
//           .eq("created_by", userId),

//         // Total jobs (assigned to mechanic)
//         supabase
//           .from("jobs")
//           .select("*", { count: "exact", head: true })
//           .eq("mechanic_id", userId),
//       ]);

//     if (inventoryRes.error) throw inventoryRes.error;
//     if (customersRes.error) throw customersRes.error;
//     if (invoicesRes.error) throw invoicesRes.error;
//     if (jobsRes.error) throw jobsRes.error;

//     const totalInventoryValue =
//       inventoryRes.data?.reduce(
//         (acc, item) => acc + (Number(item.total_price) || 0),
//         0,
//       ) || 0;

//     return {
//       parts: inventoryRes.count || 0,
//       totalInventoryValue,
//       customers: customersRes.count || 0,
//       invoices: invoicesRes.count || 0,
//       totalJobs: jobsRes.count || 0,
//     };
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);

//     return {
//       parts: 0,
//       totalInventoryValue: 0,
//       customers: 0,
//       invoices: 0,
//       totalJobs: 0,
//     };
//   }
// }

export async function fetchDashboardStatsbyId(userId) {
  console.log("USER ID:", userId);

  try {
    const [inventoryRes, customersRes, invoicesRes, jobsRes] =
      await Promise.all([
        // Inventory
        supabase
          .from("mechanic_inventory")
          .select("total_price", { count: "exact" })
          .eq("mechanic_id", userId),

        // Customers
        supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .eq("mechanic_id", userId),

        // Invoices
        supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("created_by", userId),

        // Jobs (ONLY ONE QUERY)
        supabase.from("jobs").select("job_info").eq("mechanic_id", userId),
      ]);

    if (inventoryRes.error) throw inventoryRes.error;
    if (customersRes.error) throw customersRes.error;
    if (invoicesRes.error) throw invoicesRes.error;
    if (jobsRes.error) throw jobsRes.error;

    // Inventory total value
    const totalInventoryValue =
      inventoryRes.data?.reduce(
        (acc, item) => acc + (Number(item.total_price) || 0),
        0,
      ) || 0;

    // Jobs calculations
    const jobsData = jobsRes.data || [];

    const totalJobs = jobsData.length;

    const completedJobs = jobsData.filter(
      (j) => j.job_info?.status === "completed",
    ).length;

    const pendingJobs = jobsData.filter(
      (j) => j.job_info?.status === "pending",
    ).length;

    return {
      parts: inventoryRes.count || 0,
      totalInventoryValue,
      customers: customersRes.count || 0,
      invoices: invoicesRes.count || 0,
      totalJobs,
      completedJobs,
      pendingJobs,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      parts: 0,
      totalInventoryValue: 0,
      customers: 0,
      invoices: 0,
      totalJobs: 0,
      completedJobs: 0,
      pendingJobs: 0,
    };
  }
}
