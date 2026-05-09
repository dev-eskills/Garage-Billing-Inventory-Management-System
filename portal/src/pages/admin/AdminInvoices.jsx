import React, { useState } from 'react';
import { FileText, Download, Search, Calendar, User, Car, Wrench, Clock } from 'lucide-react';
import { useInvoices } from '../../hooks/useInvoices';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminInvoices = () => {
  const { allInvoices, allInvoicesPending, allInvoicesError, downloadInvoice } = useInvoices();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredInvoices = (allInvoices || []).filter(invoice =>
    invoice.jobs?.customer_details?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.jobs?.vehicle_details?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (allInvoicesPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-md border border-gray-100 shadow-sm min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Invoice History</h3>
          <p className="text-slate-500 text-sm font-medium">Manage and download generated customer invoices</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by customer, vehicle or file..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Customer & Vehicle</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Service Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Mechanic</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No invoices found matching your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-900 font-bold text-sm">
                        <Calendar size={14} className="text-blue-500" />
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                      {invoice.jobs?.expiry_date && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase mt-1">
                          <Clock size={12} />
                          Expires: {new Date(invoice.jobs.expiry_date).toLocaleDateString()}
                        </div>
                      )}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                          <User size={14} className="text-blue-500" />
                          {invoice.jobs?.customer_details?.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium uppercase mt-0.5">
                          <Car size={12} />
                          {invoice.jobs?.vehicle_details?.name} ({invoice.jobs?.vehicle_details?.number})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[#2b5ae3] text-[10px] font-bold uppercase tracking-tight border border-blue-100">
                        {invoice.jobs?.service_type}
                      </span>
                    </td>
                    <td className="px-6 py-4  whitespace-nowrap">
                      <div onClick={() => navigate(`/admin/mechanics/${invoice?.jobs?.mechanic_id}`)} className="flex cursor-pointer hover:text-blue-600 items-center gap-1.5 text-sm text-gray-700 font-medium">
                        <Wrench size={14} className="text-slate-400" />
                        {invoice.jobs.mechanic?.full_name
                          || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        ₹ {invoice.jobs?.total_amount_full_service?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => downloadInvoice(invoice.storage_path, invoice.file_name)}
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#2b5ae3] rounded-md text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">
              No invoices found.
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                      <Calendar size={14} />
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </div>
                    <h5 className="font-bold text-gray-900">{invoice.jobs?.customer_details?.name}</h5>
                    <p className="text-[11px] text-gray-500 font-medium uppercase">{invoice.jobs?.vehicle_details?.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase mt-1">
                      <Wrench size={12} />
                      {invoice.mechanic?.full_name || 'Unassigned'}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹ {invoice.jobs?.total_amount_full_service?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[#2b5ae3] text-[10px] font-bold uppercase tracking-tight border border-blue-100">
                    {invoice.jobs?.service_type}
                  </span>
                  <a
                    href={invoice.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2b5ae3] text-white rounded-md text-[11px] font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Download size={14} />
                    PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
