import React, { useState, useMemo } from 'react';
import {
  Users, Search, Phone, Car, Wrench, Calendar,
  ChevronDown, ChevronUp, UserSquare2, Hash, IndianRupee
} from 'lucide-react';
import { useInvoices } from '../../hooks/useInvoices';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCustomers = () => {
  const { allCustomers, allCustomersPending } = useInvoices();
  console.log("allCustomers: ", allCustomers);
  console.log("allCustomersPending: ", allCustomersPending);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (allCustomers || []).filter(c =>
      c.customer_details?.name?.toLowerCase().includes(q) ||
      c.customer_details?.contact?.toLowerCase().includes(q) ||
      c.vehicle_details?.model?.toLowerCase().includes(q) ||
      c.vehicle_details?.vehicle_number?.toLowerCase().includes(q) ||
      c.mechanic?.full_name?.toLowerCase().includes(q)
    );
  }, [allCustomers, searchQuery]);

  const totalJobs = (allCustomers || []).reduce((acc, c) => acc + (c.jobs?.length || 0), 0);
  const totalRevenue = (allCustomers || []).reduce(
    (acc, c) => acc + (c.jobs || []).reduce((s, j) => s + (j.total_amount_full_service || 0), 0), 0
  );

  if (allCustomersPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-md border border-gray-100 shadow-sm min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Customer Management</h3>
        <p className="text-slate-500 text-sm font-medium">All customers registered across all mechanics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: (allCustomers || []).length, icon: Users, color: 'blue' },
          { label: 'Total Jobs', value: totalJobs, icon: Wrench, color: 'orange' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-md`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            </div>
            <h4 className="text-2xl font-black text-gray-900">{value}</h4>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, contact, vehicle, mechanic..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs font-bold text-gray-400">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_2fr_1fr_40px] gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
          <span>Customer</span>
          <span>Vehicle</span>
          <span>Assigned Mechanic</span>
          <span>Jobs</span>
          <span>Services</span>
          <span />
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-3">
              <UserSquare2 size={40} className="opacity-30" />
              <p className="font-bold text-sm">No customers found</p>
            </div>
          ) : (
            filtered.map((customer, idx) => {
              const isExpanded = expandedId === customer.id;
              const jobList = customer.jobs || [];
              const customerRevenue = jobList.reduce((s, j) => s + (j.total_amount_full_service || 0), 0);

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.025 }}
                >
                  {/* Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_1fr_40px] gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors items-center">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-base shrink-0">
                        {(customer.customer_details?.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{customer.customer_details?.name || '—'}</p>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5">
                          <Phone size={11} />
                          {customer.customer_details?.contact || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                        <Car size={14} className="text-slate-400 shrink-0" />
                        {customer.vehicle_details?.model || '—'}
                      </div>
                      {customer.vehicle_details?.vehicle_number && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5">
                          <Hash size={11} />
                          {customer.vehicle_details.vehicle_number}
                        </div>
                      )}
                    </div>

                    {/* Mechanic */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                      <Wrench size={14} className="text-slate-400 shrink-0" />
                      {customer.mechanic?.full_name || 'Unassigned'}
                    </div>

                    {/* Jobs count + revenue */}
                    <div>
                      <p className="text-sm font-black text-gray-900">{jobList.length} job{jobList.length !== 1 ? 's' : ''}</p>
                      <p className="text-[11px] text-emerald-600 font-bold">₹{customerRevenue.toLocaleString()}</p>
                    </div>

                    {/* Expand toggle */}
                    {jobList.length > 0 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>

                  {/* Expanded Jobs Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 bg-slate-50/50 border-t border-dashed border-slate-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 mb-2">Job History</p>
                          <div className="space-y-2">
                            {jobList.map((job) => (
                              <div key={job.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar size={14} className="text-blue-500 shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{job.job_info?.service_type || 'General Service'}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">
                                      {job.service_date ? new Date(job.service_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-black text-gray-900">₹{Number(job.total_amount_full_service || 0).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
