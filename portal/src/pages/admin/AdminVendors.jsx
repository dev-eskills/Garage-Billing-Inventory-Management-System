import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Store,
  Filter,
  Download,
  X as XIcon,
  Lock,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for UI demonstration
const mockVendors = [
  { id: 1, full_name: 'AutoParts Solutions', email: 'sales@autoparts.com', phone: '+91 98765 43210', category: 'Spare Parts', address: '123 Industrial Area, Mumbai', status: 'Active' },
  { id: 2, full_name: 'LubriCool Oils', email: 'contact@lubricool.in', phone: '+91 87654 32109', category: 'Lubricants', address: '456 Business Hub, Delhi', status: 'Active' },
  { id: 3, full_name: 'TyreHub India', email: 'orders@tyrehub.com', phone: '+91 76543 21098', category: 'Tyres', address: '789 Trade Center, Bangalore', status: 'Inactive' },
];

const AdminVendors = () => {
  const [vendors, setVendors] = useState(mockVendors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const filteredVendors = vendors.filter(vendor =>
    vendor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Vendors Management</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage your suppliers and service partners.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <Plus size={18} />
          Add New Vendor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-2 sm:p-3 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by vendor name, email or category..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-md font-bold border border-gray-100 hover:bg-gray-100 transition-all text-xs cursor-pointer">
            <Filter size={16} />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-md font-bold border border-gray-100 hover:bg-gray-100 transition-all text-xs cursor-pointer">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Vendors Table/List */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Vendor</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden xl:table-cell">Contact Info</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Category</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden 2xl:table-cell">Location</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase">
                          {vendor.full_name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-none">{vendor.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs font-medium">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-xs font-medium">{vendor.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[#2b5ae3] rounded-md w-fit border border-blue-100">
                        <Store size={10} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{vendor.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight border ${
                        vendor.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          vendor.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden 2xl:table-cell">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="text-xs">{vendor.address || 'No address provided'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-blue-100">
                          Edit
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === vendor.id ? null : vendor.id);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeDropdown === vendor.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 text-left">
                              <button className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                                <Lock size={14} className="text-gray-400" />
                                Portal Access
                              </button>
                              <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                                <XIcon size={14} />
                                Delete Vendor
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredVendors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No vendors found.
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div key={vendor.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-base uppercase">
                      {vendor.full_name?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{vendor.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[#2b5ae3] rounded text-[10px] font-bold border border-blue-100 uppercase">
                          <Store size={8} />
                          {vendor.category}
                        </div>
                        <div className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          vendor.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {vendor.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === vendor.id ? null : vendor.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === vendor.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          Edit Details
                        </button>
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <XIcon size={14} />
                          Delete Vendor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-xs font-medium truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-xs font-medium">{vendor.phone || 'N/A'}</span>
                  </div>
                </div>
                
                {vendor.address && (
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md flex items-center gap-2">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="italic">{vendor.address}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;