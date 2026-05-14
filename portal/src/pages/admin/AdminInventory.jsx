import React, { useState } from 'react';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  History,
  AlertTriangle,
  BarChart3,
  Calendar,
  User,
  Store,
  Hash,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminInventory } from '../../hooks/useAdminInventory';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../Components/common/Pagination';

const AdminInventory = () => {
  const {
    stockIn,
    stockOut,
    stockInLoading,
    stockOutLoading,
    currentStock,
    stockLoading
  } = useAdminInventory();
  console.log("stockOut: ", stockOut)
  const [activeTab, setActiveTab] = useState('levels');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary Stats
  const totalParts = currentStock.length;
  const lowStockParts = currentStock.filter(p => p.stock_quantity <= (p.min_stock_level || 5)).length;
  const totalStockValue = currentStock.reduce((acc, p) => acc + (Number(p.stock_quantity) * Number(p.sale_price || 0)), 0);

  // Filtering logic based on active tab
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    if (activeTab === 'levels') {
      return currentStock.filter(p =>
        p.part_name?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      )
        .sort((a, b) => {
          // 1. Primary Sort: Date (Newest date first)
          const dateCompare = new Date(b.created_at) - new Date(a.created_at);
          if (dateCompare !== 0) {
            return dateCompare;
          }
          // 2. Secondary Sort: If dates are identical, use 'created_at' or 'id'
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          // Otherwise, use ID
          return b.id.localeCompare(a.id);
        });
    }
    else if (activeTab === 'in') {
      return stockIn.filter(p =>
        p.parts?.part_name?.toLowerCase().includes(query) ||
        p.vendors?.name?.toLowerCase().includes(query)
      );
    }
    else {
      return stockOut.filter(p =>
        p.parts?.part_name?.toLowerCase().includes(query) ||
        p.profiles?.full_name?.toLowerCase().includes(query) ||
        p.profiles?.email?.toLowerCase().includes(query) ||
        p.profiles?.phone?.toLowerCase().includes(query)
      );
    }
  };

  const filteredData = getFilteredData();
  const {
    currentPage,
    totalPages,
    currentData,
    onPageChange,
    totalResults
  } = usePagination(filteredData, 10);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        onPageChange(1);
      }}
      className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold transition-all relative ${activeTab === id ? 'text-[#2b5ae3]' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
      <Icon size={16} />
      {label}
      {activeTab === id && (
        <motion.div
          layoutId="activeInventoryTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b5ae3]"
        />
      )}
    </button>
  );

  const isDataLoading =
    (activeTab === 'levels' && stockLoading) ||
    (activeTab === 'in' && stockInLoading) ||
    (activeTab === 'out' && stockOutLoading);
  console.log("currentData: ", currentData)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Inventory Control</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Monitor stock levels, purchases, and mechanic distributions.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Layers size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKUs</span>
          </div>
          <h4 className="text-2xl font-black text-gray-900">{totalParts}</h4>
          <p className="text-xs text-gray-500 font-bold mt-1">Unique parts in catalog</p>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-md">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Restock Needed</span>
          </div>
          <h4 className="text-2xl font-black text-orange-600">{lowStockParts}</h4>
          <p className="text-xs text-gray-500 font-bold mt-1">Parts below minimum level</p>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-md">
              <BarChart3 size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Value</span>
          </div>
          <h4 className="text-2xl font-black text-gray-900">₹ {totalStockValue.toLocaleString()}</h4>
          <p className="text-xs text-gray-500 font-bold mt-1">Total estimated inventory value</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 border-b border-gray-100">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <TabButton id="levels" label="Current Stock" icon={Package} />
            <TabButton id="in" label="Stock In (Purchases)" icon={ArrowDownLeft} />
            <TabButton id="out" label="Stock Out (Mechanics)" icon={ArrowUpRight} />
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-gray-600 rounded-md font-bold border border-gray-200 hover:bg-gray-50 transition-all text-xs cursor-pointer">
              <Filter size={14} />
              Filters
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-gray-600 rounded-md font-bold border border-gray-200 hover:bg-gray-50 transition-all text-xs cursor-pointer">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isDataLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm">Syncing inventory data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              {activeTab === 'levels' && (
                <>
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Part Details</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">SKU / Category</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Stock Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Unit Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentData.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">No inventory records found.</td></tr>
                    ) : (
                      currentData.map((part) => (
                        <tr key={part.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-[#2b5ae3] overflow-hidden border border-blue-100">
                                {part.image_url ? (
                                  <img src={part.image_url} alt={part.part_name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={18} />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{part.part_name}</p>
                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">{part.vendors?.name || 'No Default Vendor'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Hash size={12} className="text-gray-400" />
                                <span className="text-xs font-black text-gray-700">{part.sku}</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">{part.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-black ${part.stock_quantity <= (part.min_stock_level || 5) ? 'text-red-600' : 'text-gray-900'}`}>
                                  {part.stock_quantity} Units
                                </span>
                                {part.stock_quantity <= (part.min_stock_level || 5) && (
                                  <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border border-red-100">Low Stock</span>
                                )}
                              </div>
                              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${part.stock_quantity <= (part.min_stock_level || 5) ? 'bg-red-500' : 'bg-blue-500'}`}
                                  style={{ width: `${Math.min(100, (part.stock_quantity / (part.min_stock_level * 3 || 15)) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-bold text-gray-900">₹ {Number(part.sale_price || 0).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sale Price</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </>
              )}

              {activeTab === 'in' && (
                <>
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Purchase Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Item Detail</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Vendor Source</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-center">QTY</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentData.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No purchase history found.</td></tr>
                    ) : (
                      currentData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-xs font-bold">{new Date(item.purchase_date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-[#2b5ae3] overflow-hidden border border-blue-100">
                                {item.parts?.image_url ? (
                                  <img src={item.parts.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={14} />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{item.parts?.part_name}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{item.parts?.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Store size={14} className="text-gray-400" />
                              <span className="text-xs font-bold">{item.vendors?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+ {item.quantity}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-gray-900">₹ {Number(item.total_amount).toLocaleString()}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </>
              )}

              {activeTab === 'out' && (
                <>
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Release Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Part Details</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Mechanic Assigned</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-center">QTY</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Price/Unit</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentData.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">No mechanic distribution history found.</td></tr>
                    ) : (
                      currentData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <History size={14} className="text-gray-400" />
                              <span className="text-xs font-bold">{new Date(item.purchased_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600 overflow-hidden border border-orange-100">
                                {item.parts?.image_url ? (
                                  <img src={item.parts.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={14} />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{item.parts?.part_name}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{item.parts?.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2 text-gray-900">
                                <User size={12} className="text-blue-500" />
                                <span className="text-xs font-bold">{item.profiles?.full_name || 'Generic Service'}</span>
                              </div>
                              {item.profiles?.email && (
                                <p className="text-[10px] text-gray-500 ml-5">{item.profiles.email}</p>
                              )}
                              {item.profiles?.phone && (
                                <p className="text-[10px] text-gray-500 ml-5">{item.profiles.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">-{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="text-xs font-bold text-gray-600">₹ {Number(item.total_price / item.quantity).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-[#2b5ae3]">₹ {Number(item.total_price).toLocaleString()}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </>
              )}
            </table>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalResults={totalResults}
        pageSize={10}
      />
    </div>
  );
};

export default AdminInventory;
