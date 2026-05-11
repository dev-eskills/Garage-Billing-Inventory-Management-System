import {
  Package,
  Search,
  Calendar,
  Hash,
  IndianRupee,
  Loader2,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMechanicInventory } from "../../hooks/useMechanicInventory";
import { motion } from "framer-motion";

const MechanicParts = () => {
  const { user } = useAuth();
  const { mechanicInventory, isInventoryPending } = useMechanicInventory(
    user?.id,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = useMemo(() => {
    if (!mechanicInventory) return [];
    return mechanicInventory.filter(
      (item) =>
        item.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [mechanicInventory, searchTerm]);

  return (
    <div className="flex flex-col h-[60vh] bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm relative">
      {/* Header section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Personal Inventory
              </h2>
              <p className="text-sm text-slate-500">
                Aggregated parts available for your jobs.
              </p>
            </div>
          </div>

          <div className="relative min-w-[280px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {isInventoryPending ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-slate-500 font-medium">
              Loading your inventory...
            </p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No parts found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              {searchTerm
                ? "Try adjusting your search terms."
                : "You haven't purchased any parts yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.part_id}
                className="group bg-white rounded-lg p-5 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Package size={80} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.part_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-emerald-100">
                      In Stock
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.part_name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Hash size={12} />
                    <span>SKU: {item.sku || "N/A"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Total Quantity
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                         {item.total_quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Avg Unit Price
                      </p>
                      <p className="text-lg font-bold text-slate-900 flex items-center justify-end gap-0.5">
                        <IndianRupee size={14} />
                        {Number(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar size={12} />
                      <span>
                        Latest:{" "}
                        {new Date(item.latest_purchase_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      Value: ₹{Number(item.total_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicParts;
