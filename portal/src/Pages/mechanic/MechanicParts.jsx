import { Package, Search, Calendar, Hash, IndianRupee, Loader2, Edit2, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMechanicInventory } from "../../hooks/useMechanicInventory";
import { motion, AnimatePresence } from "framer-motion";


const MechanicParts = () => {
  const { user } = useAuth();
  const { mechanicInventory, isInventoryPending, updateMechanicStock, updateMechanicStockIsPending } = useMechanicInventory(user?.id);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: 0 });

  const filteredInventory = useMemo(() => {
    if (!mechanicInventory) return [];
    return mechanicInventory.filter(item => 
      item.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mechanicInventory, searchTerm]);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditForm({
      quantity: item.total_quantity
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await updateMechanicStock({
        mechanicId: user.id,
        partId: editingItem.part_id,
        newQuantity: editForm.quantity,
      });
      setEditingItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
      {/* Header section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Personal Inventory</h2>
              <p className="text-sm text-slate-500">Parts purchased and available for your jobs.</p>
            </div>
          </div>
          
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search parts by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {isInventoryPending ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-slate-500 font-medium">Loading your inventory...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No parts found</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              {searchTerm ? "Try adjusting your search terms." : "You haven't purchased any parts yet."}
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
                className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Package size={80} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.part_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm"
                      >
                        <Edit2 size={14} />
                      </button>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-emerald-100">
                        In Stock
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.part_name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Hash size={12} />
                    <span>SKU: {item.sku || 'N/A'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total Quantity</p>
                      <p className="text-lg font-bold text-slate-900">{item.total_quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Recent Unit Price</p>
                      <p className="text-lg font-bold text-slate-900 flex items-center justify-end gap-0.5">
                        <IndianRupee size={14} />
                        {Number(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar size={12} />
                      <span>Latest: {new Date(item.latest_purchase_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      Total Value: ₹{Number(item.total_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Edit2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Edit Inventory</h3>
                    <p className="text-xs text-slate-500">Adjust stock levels for {editingItem.part_name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Quantity</label>
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter new total quantity"
                    required
                  />
                </div>



                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMechanicStockIsPending}
                    className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {updateMechanicStockIsPending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default MechanicParts;
