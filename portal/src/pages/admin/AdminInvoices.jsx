import React, { useState } from 'react';
import {
  FileText, Download, Search, Calendar,
  User, Car, Wrench, Clock, ExternalLink, IndianRupee, ReceiptText
} from 'lucide-react';
import { useInvoices } from '../../hooks/useInvoices';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminInvoices = () => {
  const { allInvoices, allInvoicesPending, downloadInvoice } = useInvoices();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  console.log("allInvoices from admin invoices: ",allInvoices);
  // RPC returns flat columns now
  const filtered = allInvoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    return (
      (inv.customer_name || '').toLowerCase().includes(q) ||
      (inv.vehicle_model || '').toLowerCase().includes(q) ||
      (inv.vehicle_number || '').toLowerCase().includes(q) ||
      (inv.mechanic_name || '').toLowerCase().includes(q) ||
      (inv.file_name || '').toLowerCase().includes(q)
    );
  });

  const totalAmount = allInvoices.reduce((acc, inv) => acc + (inv?.jobs?.total_amount_full_service || 0), 0);
  const thisMonth = allInvoices.filter(
    i => new Date(i.created_at).getMonth() === new Date().getMonth()
  ).length;
  console.log("totalAmount from admin invoices component: ", totalAmount)
  if (allInvoicesPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-md border border-gray-100 shadow-sm min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Invoice History</h3>
        <p className="text-slate-500 text-sm font-medium">Manage and download all generated customer invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Invoices', value: allInvoices.length, icon: ReceiptText, colorClass: 'bg-blue-50 text-blue-600' },
          { label: 'Total Billed', value: `₹${totalAmount.toLocaleString()}`, icon: IndianRupee, colorClass: 'bg-green-50 text-green-600' },
          { label: 'This Month', value: thisMonth, icon: Calendar, colorClass: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, colorClass }) => (
          <div key={label} className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-md ${colorClass}`}><Icon size={20} /></div>
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
            placeholder="Search by customer, vehicle, mechanic or file..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs font-bold text-gray-400">{filtered.length} invoice{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50">
                {['Date', 'Customer & Vehicle', 'Service Type', 'Mechanic', 'Amount', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ReceiptText size={40} className="opacity-30" />
                      <p className="font-bold text-sm">No invoices found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((inv, idx) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-900 font-bold text-sm">
                        <Calendar size={14} className="text-blue-500" />
                        {new Date(inv.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      {inv.expiry_date && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-1">
                          <Clock size={11} />
                          Due: {new Date(inv.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                        <User size={14} className="text-blue-500 shrink-0" />
                        {inv?.jobs?.customers?.customer_details?.name || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-0.5">
                        <Car size={12} className="shrink-0" />
                        {[inv?.jobs?.customers?.vehicle_details?.model, inv?.jobs?.customers?.vehicle_details?.vehicle_number ? `(${inv?.jobs?.customers?.vehicle_details?.vehicle_number})` : ''].filter(Boolean).join(' ') || '—'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[#2b5ae3] text-[10px] font-bold uppercase tracking-tight border border-blue-100">
                        {inv?.jobs?.job_info?.service_type || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                        <Wrench size={14} className="text-slate-400" />
                        {inv?.jobs?.mechanic?.full_name || 'Unassigned'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        ₹ {Number(inv?.jobs?.total_amount_full_service || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        {inv.public_url && (
                          <a
                            href={inv.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-100 border border-gray-200 transition-colors"
                          >
                            <ExternalLink size={13} />
                            View
                          </a>
                        )}
                        <button
                          onClick={() => downloadInvoice(inv.storage_path, inv.file_name)}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2b5ae3] rounded-md text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <Download size={13} />
                          PDF
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
