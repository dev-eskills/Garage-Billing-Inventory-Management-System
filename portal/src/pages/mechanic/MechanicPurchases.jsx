import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  Calendar, 
  Hash, 
  IndianRupee, 
  Loader2, 
  ChevronRight,
  ArrowRightLeft,
  Package,
  History,
  Filter
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMechanicPurchases } from "../../hooks/useMechanicPurchases";
import { motion } from "framer-motion";

const MechanicPurchases = () => {
  const { user } = useAuth();
  const { purchases, isLoading } = useMechanicPurchases(user?.id);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'in', 'out'
  const [dateSort, setDateSort] = useState("newest"); // 'newest', 'oldest'

  const filteredPurchases = useMemo(() => {
    let result = purchases.filter(p => 
      p.parts?.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parts?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType === "in") {
      result = result.filter(p => p.quantity > 0);
    } else if (filterType === "out") {
      result = result.filter(p => p.quantity < 0);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.purchased_at).getTime();
      const dateB = new Date(b.purchased_at).getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [purchases, searchTerm, filterType, dateSort]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      {/* Header section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <History size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Purchase History</h2>
              <p className="text-sm text-slate-500">Record of all inventory transactions and stock movements.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search part name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm"
              >
                <option value="all">All Types</option>
                <option value="in">Purchases (In)</option>
                <option value="out">Usage (Out)</option>
              </select>

              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-sm text-slate-500 font-medium">Loading history...</p>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No transactions found</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              {searchTerm || filterType !== 'all' ? "Try adjusting your filters." : "No inventory history available yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPurchases.map((purchase, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                key={purchase.id}
                className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4"
              >
                {/* Part Image/Icon */}
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center text-slate-400 shrink-0 shadow-inner">
                  {purchase.parts?.image_url ? (
                    <img src={purchase.parts.image_url} alt={purchase.parts.part_name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} />
                  )}
                </div>

                {/* Part Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-bold text-slate-800 truncate">
                      {purchase.parts?.part_name || 'Unknown Part'}
                    </h4>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      purchase.quantity > 0 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {purchase.quantity > 0 ? 'Purchase (In)' : 'Usage (Out)'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                      <Hash size={12} className="text-slate-400"/>
                      {purchase.parts?.sku || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400"/>
                      {new Date(purchase.purchased_at).toLocaleDateString('en-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Quantity & Pricing */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 px-2 md:px-6 md:border-l border-slate-100 w-full md:w-auto pt-3 md:pt-0 mt-3 md:mt-0 border-t md:border-t-0">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Quantity</p>
                    <p className={`text-lg font-black ${purchase.quantity > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {purchase.quantity > 0 ? '+' : ''}{purchase.quantity}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Unit Price</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-0.5">
                      <IndianRupee size={14} />
                      {Number(purchase.unit_price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total</p>
                    <p className="text-lg font-black text-slate-900 flex items-center justify-end gap-0.5">
                      <IndianRupee size={16} />
                      {Math.abs(Number(purchase.total_price)).toLocaleString()}
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

export default MechanicPurchases;
