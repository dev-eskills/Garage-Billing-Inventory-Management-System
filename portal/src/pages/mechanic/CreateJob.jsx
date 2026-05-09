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
  AlertCircle
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
  console.log(mechanicInventory);


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
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <PlusCircle className="text-blue-600" size={32} />
              Create New Job
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Register a new service and deduct used parts from your inventory.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <X size={18} />
            Cancel
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* Customer Selection Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Customer Details</h2>
              </div>
              <div className="p-8">
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Customer</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={selectedCustomer?.id || ""}
                      onChange={(e) => {
                        const customer = customers.find(c => c.id === e.target.value);
                        setSelectedCustomer(customer);
                      }}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Choose a customer...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.customer_details.name} ({c.customer_details?.contact})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>

                  {selectedCustomer && (
                    <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-indigo-900">{selectedCustomer.customer_details.name}</p>
                        <p className="text-xs text-indigo-500">{selectedCustomer.customer_details?.contact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Job Information</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Repair Issue</label>
                  <input
                    type="text"
                    value={jobDetails.repair_issue}
                    onChange={(e) => setJobDetails({ ...jobDetails, repair_issue: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Type</label>
                  <input
                    type="text"
                    value={jobDetails.service_type}
                    onChange={(e) => setJobDetails({ ...jobDetails, service_type: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                    <Calendar size={14} /> Service Date
                  </label>
                  <input
                    type="date"
                    value={jobDetails.service_date}
                    onChange={(e) => setJobDetails({ ...jobDetails, service_date: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                    <AlertCircle size={14} /> Next Service Due (Expiry)
                  </label>
                  <input
                    type="date"
                    value={jobDetails.expiry_date}
                    onChange={(e) => setJobDetails({ ...jobDetails, expiry_date: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parts Section Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Package size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Parts Used</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPartModalOpen(true)}
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 transition-all flex items-center gap-2 shadow-sm shadow-amber-500/20"
                >
                  <Plus size={18} />
                  Add Parts from Stock
                </button>
              </div>

              <div className="p-8">
                {usedParts.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">No parts selected from stock</p>
                    <p className="text-xs mt-1">Search and select parts above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usedParts.map(part => (
                      <div key={part.part_id} className="flex items-center gap-6 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                          {part.image_url ? (
                            <img src={part.image_url} alt={part.part_name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 truncate">{part.part_name}</h4>
                          <p className="text-xs text-slate-400">Unit Price: ₹{part.unit_price}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleUpdatePartQuantity(part.part_id, part.quantity - 1)}
                            className="p-1 hover:bg-slate-50 rounded text-slate-500"
                          >-</button>
                          <span className="w-8 text-center font-bold text-slate-800">{part.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdatePartQuantity(part.part_id, part.quantity + 1)}
                            className="p-1 hover:bg-slate-50 rounded text-slate-500"
                          >+</button>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Total</p>
                          <p className="font-bold text-slate-900">₹{(part.quantity * part.unit_price).toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePart(part.part_id)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Parts Total</p>
                        <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
                          <IndianRupee size={20} />
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
          <div className="space-y-8">
            {/* Extra Service Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Extra Service</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Description</label>
                  <textarea
                    rows={3}
                    value={extraService.description}
                    onChange={(e) => setExtraService({ ...extraService, description: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-sm resize-none"
                    placeholder="E.g. Car Wash, Polishing..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={extraService.amount}
                      onChange={(e) => setExtraService({ ...extraService, amount: e.target.value })}
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Final Calculation Summary */}
                <div className="pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-slate-800 font-bold">₹{subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Discount ({discount}%)</span>
                    <span className="text-red-500 font-bold">- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Total Amount</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingJob}
                  className="w-full mt-6 py-5 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isCreatingJob ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      Submit & Save Job
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Select Parts</h3>
                    <p className="text-sm text-slate-500 font-medium">Add parts from your current stock</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPartModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-6 bg-white border-b border-slate-50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search parts by name, SKU or category..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal Content - Parts List */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {isInventoryPending ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-amber-500" size={40} />
                    <p className="text-slate-500 font-bold">Fetching your inventory...</p>
                  </div>
                ) : filteredInventory.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                      <Package size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-700">No parts found</h4>
                    <p className="text-slate-400 mt-2">We couldn't find any parts matching your search. Try different keywords or check your stock.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredInventory.map(item => {
                      const isAdded = usedParts.some(p => p.part_id === item.part_id);
                      return (
                        <div 
                          key={item.part_id}
                          className={`p-4 rounded-3xl border transition-all flex items-center gap-4 ${
                            isAdded 
                            ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' 
                            : 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer'
                          }`}
                          onClick={() => !isAdded && handleAddPart(item)}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.part_name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={24} className="text-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-800 text-sm truncate">{item.part_name}</h5>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[11px] font-bold text-blue-600">Stock: {item.total_quantity}</p>
                              <p className="text-[11px] font-black text-slate-900">₹{item.unit_price}</p>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isAdded ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-300'
                          }`}>
                            {isAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  {usedParts.length} parts selected for this job
                </p>
                <button
                  onClick={() => setIsPartModalOpen(false)}
                  className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  Done Selecting
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
