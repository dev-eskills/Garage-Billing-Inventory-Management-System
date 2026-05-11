import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  Search,
  User,
  Calendar,
  Package,
  Plus,
  Trash2,
  IndianRupee,
  Percent,
  FileText,
  CheckCircle2,
  Loader2,
  ChevronDown,
  X,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useCustomers } from "../../hooks/useCustomers";
import { useMechanicInventory } from "../../hooks/useMechanicInventory";
import { useJobs } from "../../hooks/useJobs";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { customers, customersLoading } = useCustomers(user?.id);
  const { mechanicInventory, isInventoryPending } = useMechanicInventory(user?.id);
  const { createJob, isCreatingJob } = useJobs(user?.id);

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [jobDetails, setJobDetails] = useState({
    service_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
    status: "completed",
    repair_issue: "General Service",
    service_type: "Full Diagnostic & Armor Repair"
  });

  const [usedParts, setUsedParts] = useState([]);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const filteredInventory = useMemo(() => {
    return mechanicInventory.filter(item =>
      item.part_name?.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.sku?.toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [mechanicInventory, localSearch]);

  const [extraService, setExtraService] = useState({
    amount: 0,
    description: ""
  });

  const [discount, setDiscount] = useState(0);

  // Calculations
  const partsTotal = useMemo(() => {
    return usedParts.reduce((acc, part) => acc + (part.quantity * part.unit_price), 0);
  }, [usedParts]);

  const subTotal = partsTotal + parseFloat(extraService.amount || 0);
  const discountAmount = (subTotal * parseFloat(discount || 0)) / 100;
  const finalTotal = subTotal - discountAmount;

  const handleAddPart = (part) => {
    if (usedParts.find(p => p.part_id === part.part_id)) {
      return;
    }
    setUsedParts([...usedParts, {
      ...part,
      quantity: 1
    }]);
  };

  const handleUpdatePartQuantity = (partId, qty) => {
    const inventoryItem = mechanicInventory.find(i => i.part_id === partId);
    const maxQty = inventoryItem?.total_quantity || 0;

    const newQty = Math.max(1, Math.min(qty, maxQty));
    setUsedParts(usedParts.map(p => p.part_id === partId ? { ...p, quantity: newQty } : p));
  };

  const handleRemovePart = (partId) => {
    setUsedParts(usedParts.filter(p => p.part_id !== partId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    const jobData = {
      mechanic_id: user.id,
      customer_id: selectedCustomer.id,
      service_date: jobDetails.service_date,
      expiry_date: jobDetails.expiry_date,
      job_info: {
        status: jobDetails.status,
        repair_issue: jobDetails.repair_issue,
        service_type: jobDetails.service_type
      },
      parts_items: usedParts.map(p => ({
        part_id: p.part_id,
        part_name: p.part_name,
        quantity: p.quantity,
        unit_price: p.unit_price,
        total_price: p.quantity * p.unit_price
      })),
      extra_service: {
        amount: parseFloat(extraService.amount),
        description: extraService.description
      },
      discount_percentage: parseFloat(discount),
      total_amount_full_service: finalTotal
    };

    try {
      await createJob(jobData);
      navigate("/mechanic/all-jobs");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                <PlusCircle size={24} />
              </div>
              Create New Job
            </h1>
            <p className="text-slate-500 mt-2">Register a new service and deduct used parts from your inventory.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <X size={18} />
            Cancel
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer Selection Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Customer Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={selectedCustomer?.id || ""}
                      onChange={(e) => {
                        const customer = customers.find(c => c.id === e.target.value);
                        setSelectedCustomer(customer);
                      }}
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Choose a customer...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c?.customer_details?.name} ({c.customer_details?.contact})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>

                  {selectedCustomer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-emerald-900">{selectedCustomer.customer_details.name}</p>
                        <p className="text-xs text-emerald-600 font-medium">{selectedCustomer.customer_details?.contact}</p>
                      </div>
                      <div className="text-emerald-500">
                        <CheckCircle2 size={20} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Job Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Repair Issue</label>
                  <input
                    type="text"
                    value={jobDetails.repair_issue}
                    onChange={(e) => setJobDetails({ ...jobDetails, repair_issue: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Service Type</label>
                  <input
                    type="text"
                    value={jobDetails.service_type}
                    onChange={(e) => setJobDetails({ ...jobDetails, service_type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1 flex items-center gap-1.5">
                    <Calendar size={12} /> Service Date
                  </label>
                  <input
                    type="date"
                    value={jobDetails.service_date}
                    onChange={(e) => setJobDetails({ ...jobDetails, service_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Next Service Due
                  </label>
                  <input
                    type="date"
                    value={jobDetails.expiry_date}
                    onChange={(e) => setJobDetails({ ...jobDetails, expiry_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parts Section Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Parts Used</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPartModalOpen(true)}
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  Add Parts from Stock
                </button>
              </div>

              <div className="p-6">
                {usedParts.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-lg text-slate-400">
                    <Package size={40} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">No parts selected from stock</p>
                    <p className="text-[10px] mt-1">Click the button above to select parts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {usedParts.map(part => (
                      <div key={part.part_id} className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-lg hover:border-blue-100 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                          {part.image_url ? (
                            <img src={part.image_url} alt={part.part_name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{part.part_name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Price: ₹{part.unit_price}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                          <button
                            type="button"
                            onClick={() => handleUpdatePartQuantity(part.part_id, part.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded text-slate-500 text-lg"
                          >-</button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">{part.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdatePartQuantity(part.part_id, part.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded text-slate-500 text-lg"
                          >+</button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total</p>
                          <p className="text-sm font-bold text-slate-900">₹{(part.quantity * part.unit_price).toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePart(part.part_id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-3 border-t border-slate-100 mt-4">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Parts Total</p>
                        <p className="text-xl font-bold text-slate-900 flex items-center gap-1 justify-end">
                          <IndianRupee size={16} />
                          {partsTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area - Summary & Extra Services */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden sticky top-8">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Summary</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Extra Service</label>
                  <textarea
                    rows={2}
                    value={extraService.description}
                    onChange={(e) => setExtraService({ ...extraService, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-none"
                    placeholder="Describe extra work..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Service Fee (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="number"
                      value={extraService.amount}
                      onChange={(e) => setExtraService({ ...extraService, amount: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Final Calculation Summary */}
                <div className="pt-4 space-y-2.5">
                  <div className="flex justify-between text-[11px] font-medium uppercase tracking-tight">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-700">₹{subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium uppercase tracking-tight">
                    <span className="text-slate-400">Discount</span>
                    <span className="text-red-500">- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-50 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-500 uppercase">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-1">
                      <IndianRupee size={20} />
                      {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingJob}
                  className="w-full mt-4 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isCreatingJob ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Submit Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Parts Selection Modal */}
      <AnimatePresence>
        {isPartModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPartModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Select Parts</h3>
                    <p className="text-xs text-slate-500 font-medium">Add parts from your hand stock</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPartModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-4 bg-white border-b border-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search name, SKU or category..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal Content - Parts List */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isInventoryPending ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                    <p className="text-xs text-slate-500 font-bold">Fetching inventory...</p>
                  </div>
                ) : filteredInventory.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                      <Package size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-700">No parts found</h4>
                    <p className="text-xs text-slate-400 mt-1">Try a different search term or check your inventory.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredInventory.map(item => {
                      const isAdded = usedParts.some(p => p.part_id === item.part_id);
                      return (
                        <div 
                          key={item.part_id}
                          className={`p-3 rounded-lg border transition-all flex items-center gap-3 cursor-pointer ${
                            isAdded 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'
                          }`}
                          onClick={() => !isAdded && handleAddPart(item)}
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.part_name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={20} className="text-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-800 text-xs truncate">{item.part_name}</h5>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-[10px] font-bold text-blue-600">Stock: {item.total_quantity}</p>
                              <p className="text-[10px] font-bold text-slate-900">₹{item.unit_price}</p>
                            </div>
                          </div>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isAdded ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-300'
                          }`}>
                            {isAdded ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500">
                  {usedParts.length} items added
                </p>
                <button
                  onClick={() => setIsPartModalOpen(false)}
                  className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateJob;
