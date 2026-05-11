import { Package, IndianRupee } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const PartsUsed = ({ jobDetails }) => {
  const partsItems = jobDetails?.parts_items || [];
  console.log(jobDetails);

  return (
    <div className="flex flex-col h-[60vh] bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Parts Used
            </h2>
            <p className="text-sm text-slate-500">
              Parts that have been used in this job
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {partsItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No parts used in this job
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partsItems.map((item, index) => (
              <motion.div
                key={item.part_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-lg p-5 border border-slate-200 hover:border-orange-200 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Package size={80} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                      <Package size={24} />
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-red-100">
                      Used
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                    {item.part_name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Quantity Used
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Unit Price
                      </p>
                      <p className="text-lg font-bold text-slate-900 flex items-center justify-end gap-0.5">
                        <IndianRupee size={14} />
                        {Number(item.total_price).toLocaleString() /
                          item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <p className="text-sm font-bold text-orange-600">
                      Total: ₹{Number(item.total_price).toLocaleString()}
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

export default PartsUsed;
