import { supabase } from "../lib/supabaseClient";

export async function recordMechanicInventory(inventoryData) {
  const { data, error } = await supabase
    .from("mechanic_inventory")
    .insert(inventoryData)
    .select();

  if (error) {
    console.error("Error recording mechanic inventory:", error.message);
    throw error;
  }
  return data;
}

export async function fetchMechanicInventory(mechanicId) {
  if (!mechanicId) return [];
  const { data, error } = await supabase.rpc(
    "get_mechanic_aggregated_inventory",
    { target_mechanic_id: mechanicId },
  );

  if (error) {
    console.error("Error fetching mechanic inventory:", error.message);
    throw error;
  }
  return data;
}

export async function updateMechanicStock({ mechanicId, partId, newQuantity }) {
  // 1. Get current total quantity
  const { data: currentRecords, error: fetchError } = await supabase
    .from("mechanic_inventory")
    .select("quantity, unit_price")
    .eq("mechanic_id", mechanicId)
    .eq("part_id", partId);

  if (fetchError) throw fetchError;

  const currentTotal =
    currentRecords?.reduce((acc, rec) => acc + (rec.quantity || 0), 0) || 0;
  const latestUnitPrice =
    currentRecords?.[currentRecords.length - 1]?.unit_price || 0;

  const difference = parseInt(newQuantity) - currentTotal;

  if (difference !== 0) {
    // 2. Insert adjustment record
    const { error: insertError } = await supabase
      .from("mechanic_inventory")
      .insert({
        mechanic_id: mechanicId,
        part_id: partId,
        quantity: difference,
        unit_price: latestUnitPrice,
        total_price: difference * latestUnitPrice,
        purchased_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;
  }
}
export async function fetchAllMechanicInventory(mechanicId) {
  if (!mechanicId) return [];
  const { data, error } = await supabase
    .from("mechanic_inventory")
    .select(
      `
      *,
      parts (*)
    `,
    )
    .eq("mechanic_id", mechanicId)
    .order("purchased_at", { ascending: false });

  if (error) {
    console.error("Error fetching all mechanic inventory:", error.message);
    throw error;
  }
  return data;
}

export async function fetchInventoryUsage(mechanicId) {
  if (!mechanicId) return [];

  try {
    const { data, error } = await supabase
      .from("mechanic_inventory")
      .select(
        `
        *,
        parts (*)
      `,
      )
      .eq("mechanic_id", mechanicId);

    if (error) throw error;

    const inventory = data || [];

    // 🔥 GROUP BY PART ID
    const grouped = {};

    inventory.forEach((item) => {
      const partId = item.part_id;

      if (!grouped[partId]) {
        grouped[partId] = {
          name: item.parts?.part_name || "Unknown Part",
          total: 0,
          used: 0,
        };
      }

      grouped[partId].total += Number(item.quantity) || 0;
      grouped[partId].used += Number(item.used_quantity) || 0; // FIXED
    });

    return Object.values(grouped).map((item) => {
      const remaining = item.total - item.used;

      return {
        name: item.name,
        total: item.total,
        used: item.used,
        remaining,
        usagePercent: item.total > 0 ? (item.used / item.total) * 100 : 0,
      };
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return [];
  }
}
