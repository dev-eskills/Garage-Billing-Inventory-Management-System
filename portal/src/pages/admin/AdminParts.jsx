import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Filter,
  Download,
  Package,
  Hash,
  Tag,
  AlertTriangle,
  Trash2,
  User,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Save,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddPartModal from '../../components/admin/AddPartModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { useParts } from '../../hooks/useParts';
import { useAdminPurchase } from '../../hooks/useAdminPurchase';

const AdminParts = () => {
  const { parts, partsPending, deletePart, deletePartPending, updatePartSalePrice, updatePartSalePricePending } = useParts();
  const { purchases, purchasesPending } = useAdminPurchase();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'purchased'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [partToDelete, setPartToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedPartId, setExpandedPartId] = useState(null);
  const [salePrices, setSalePrices] = useState({});

  const handleEdit = (part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPart(null);
  };

  const handleAddNew = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setPartToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!partToDelete) return;
    try {
      await deletePart(partToDelete);
      setPartToDelete(null);
    } catch (err) {
      // Error is handled by the hook's toast
    }
  };

  const handleSaveSalePrice = async (partId) => {
    if (salePrices[partId] !== undefined) {
      try {
        await updatePartSalePrice({ id: partId, sale_price: salePrices[partId] });
      } catch (err) { }
    }
  };

  const handleSalePriceChange = (partId, value) => {
    setSalePrices(prev => ({ ...prev, [partId]: value }));
  };

  const toggleExpand = (partId) => {
    setExpandedPartId(prev => prev === partId ? null : partId);
  };

  const filteredParts = (parts || []).filter(part =>
    part.part_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group purchases by part_id for the "Purchased Parts" tab
  const purchasedPartsData = filteredParts.filter(part => part.stock_quantity > 0 || purchases?.some(p => p.part_id === part.id)).map(part => {
    const partPurchases = purchases?.filter(p => p.part_id === part.id) || [];
    const totalPurchasedAmount = partPurchases.reduce((sum, p) => sum + (Number(p.total_amount) || 0), 0);
    const totalPurchasedQuantity = partPurchases.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    return {
      ...part,
      partPurchases,
      totalPurchasedAmount,
      totalPurchasedQuantity
    };
  });

  return (
   

    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Inventory Management</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage your garage parts and stock levels.</p>
        </div>
        {activeTab === 'catalog' && (
          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <Plus size={18} />
            Add New Part
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'catalog' ? 'text-[#2b5ae3]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Package size={16} />
            Part Catalog
          </div>
          {activeTab === 'catalog' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b5ae3]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('purchased')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'purchased' ? 'text-[#2b5ae3]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} />
            Purchased Parts
          </div>
          {activeTab === 'purchased' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b5ae3]" />
          )}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by part name, SKU, or category..."
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

      {/* Parts List */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === 'catalog' ? (
          <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Part Details</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">SKU / Category</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partsPending ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading parts...
                      </div>
                    </td>
                  </tr>
                ) : filteredParts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                      No parts found.
                    </td>
                  </tr>
                ) : (
                  filteredParts.map((part) => {
                    const isLowStock = part.stock_quantity <= part.min_stock_level;
                    return (
                      <tr key={part.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0">
                              {part.image_url ? (
                                <img src={part.image_url} alt={part.part_name} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-none">{part.part_name}</p>
                              {part.vendors && (
                                <p className="text-[10px] font-bold text-[#2b5ae3] mt-1 uppercase flex items-center gap-1">
                                  <User size={10} />
                                  {part.vendors.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Hash size={12} className="text-gray-400" />
                              <span className="text-xs font-bold uppercase tracking-tight">{part.sku}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Tag size={12} className="text-gray-400" />
                              <span className="text-xs font-medium">{part.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(part)}
                              className="px-3 py-1.5 text-xs font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(part.id)}
                              disabled={deletePartPending}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
                              title="Delete Part"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

        {/* Mobile Card View */}
        <div className="block md:hidden divide-y divide-gray-50">
          {partsPending ? (
            <div className="px-6 py-10 text-center text-gray-500 font-medium flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Loading parts...
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500 font-medium">
              No parts found.
            </div>
          ) : (
            filteredParts.map((part) => {
              const isLowStock = part.stock_quantity <= part.min_stock_level;
              return (
                <div key={part.id} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0">
                        {part.image_url ? (
                          <img src={part.image_url} alt={part.part_name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{part.part_name}</p>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-tight">ID: {part.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    {isLowStock ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight bg-red-50 text-red-700 border border-red-100">
                        <AlertTriangle size={10} className="mr-1" />
                        Low
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500"></span>
                        OK
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-md p-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SKU / Category</p>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Hash size={12} className="text-gray-400" />
                          <span className="text-xs font-bold uppercase tracking-tight">{part.sku}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Tag size={12} className="text-gray-400" />
                          <span className="text-xs font-medium">{part.category}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock & Price</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {part.stock_quantity}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">/ Min {part.min_stock_level}</span>
                        </div>
                        <div className="text-sm font-bold text-[#2b5ae3]">
                          ${Number(part.unit_price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(part)}
                      className="flex-1 px-3 py-2 text-xs font-bold text-[#2b5ae3] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                    >
                      Edit Part
                    </button>
                    <button
                      onClick={() => handleDeleteClick(part.id)}
                      disabled={deletePartPending}
                      className="px-3 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
                      title="Delete Part"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </>
        ) : (
          /* Purchased Parts Tab */
          <div className="overflow-x-auto pb-20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Part Details</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Category</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Total Stock</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Sale Price (₹)</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partsPending || purchasesPending ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Loading purchased parts...
                    </td>
                  </tr>
                ) : purchasedPartsData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      No purchased parts found.
                    </td>
                  </tr>
                ) : (
                  purchasedPartsData.map((item) => (
                    <React.Fragment key={`purchased-${item.id}`}>
                      <tr className="hover:bg-gray-50/50 transition-colors group text-sm cursor-pointer" onClick={() => toggleExpand(item.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.part_name} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-none">{item.part_name}</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">{item.stock_quantity || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={salePrices[item.id] !== undefined ? salePrices[item.id] : (item.sale_price || '')}
                              onChange={(e) => handleSalePriceChange(item.id, e.target.value)}
                              className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2b5ae3]"
                              placeholder="0.00"
                            />
                            <button
                              onClick={() => handleSaveSalePrice(item.id)}
                              disabled={updatePartSalePricePending}
                              className="p-1.5 text-white bg-[#2b5ae3] hover:bg-blue-600 rounded disabled:opacity-50 transition-colors"
                              title="Save Sale Price"
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            {expandedPartId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Sub-table */}
                  <AnimatePresence>
                    {expandedPartId === item.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan="5" className="px-6 py-4 bg-gray-50/80 border-b border-gray-100">
                          <div className="pl-12">
                            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <ShoppingBag size={14} className="text-[#2b5ae3]" />
                              Purchase History from Vendors
                            </h5>
                            {item.partPurchases.length === 0 ? (
                              <p className="text-sm text-gray-500 italic mb-2">No purchase records found.</p>
                            ) : (
                              <table className="w-full text-left bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden mb-3">
                                <thead>
                                  <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-4 py-2.5 font-bold w-2/5">Vendor Name</th>
                                    <th className="px-4 py-2.5 font-bold text-right w-1/5">Per Part Price</th>
                                    <th className="px-4 py-2.5 font-bold text-center w-1/5">Quantity</th>
                                    <th className="px-4 py-2.5 font-bold text-right w-1/5">Total Price</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                  {item.partPurchases.map(pur => (
                                    <tr key={pur.id} className="hover:bg-blue-50/30 transition-colors">
                                      <td className="px-4 py-3 font-medium text-gray-900">{pur.vendors?.name || 'N/A'}</td>
                                      <td className="px-4 py-3 text-right font-medium text-gray-700">₹ {Number(pur.unit_price || 0).toLocaleString()}</td>
                                      <td className="px-4 py-3 text-center font-bold text-gray-900">{pur.quantity}</td>
                                      <td className="px-4 py-3 text-right font-bold text-[#2b5ae3]">₹ {Number(pur.total_amount || 0).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-blue-50/50 border-t border-blue-100/50">
                                  <tr>
                                    <td colSpan="2" className="px-4 py-3 text-right font-bold text-gray-700 text-xs uppercase tracking-wider">Total:</td>
                                    <td className="px-4 py-3 text-center font-bold text-gray-900 text-sm">{item.totalPurchasedQuantity}</td>
                                    <td className="px-4 py-3 text-right font-bold text-[#2b5ae3] text-sm">₹ {item.totalPurchasedAmount.toLocaleString()}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
          )}
        </tbody>
      </table>
    </div>
  )
}
      </div >

  {/* Modal */ }
  < AnimatePresence >
  { isModalOpen && (
    <AddPartModal
      onClose={handleCloseModal}
      editData={selectedPart}
    />
  )}
      </AnimatePresence >

  {/* Reusable Delete Confirmation Modal */ }
  < DeleteConfirmModal
isOpen = {!!partToDelete}
onClose = {() => setPartToDelete(null)}
onConfirm = { handleConfirmDelete }
title = "Delete Part"
message = "Are you sure you want to delete this part? This will permanently remove it from your inventory. This action cannot be undone."
isPending = { deletePartPending }
  />
    </div >
  );
};

export default AdminParts;
