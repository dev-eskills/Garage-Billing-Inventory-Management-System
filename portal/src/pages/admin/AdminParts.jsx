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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddPartModal from '../../components/admin/AddPartModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { useParts } from '../../hooks/useParts';

const AdminParts = () => {
  const { parts, partsPending, deletePart, deletePartPending } = useParts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [partToDelete, setPartToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredParts = (parts || []).filter(part =>
    part.part_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Inventory Management</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage your garage parts and stock levels.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <Plus size={18} />
          Add New Part
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

      {/* Parts Table */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Part Details</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">SKU / Category</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Stock</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Unit Price</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {part.stock_quantity}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/ Min: {part.min_stock_level}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{Number(part.unit_price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isLowStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight bg-red-50 text-red-700 border border-red-100">
                            <AlertTriangle size={10} className="mr-1" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight bg-green-50 text-green-700 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500"></span>
                            In Stock
                          </span>
                        )}
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
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddPartModal
            onClose={handleCloseModal}
            editData={selectedPart}
          />
        )}
      </AnimatePresence>

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!partToDelete}
        onClose={() => setPartToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Part"
        message="Are you sure you want to delete this part? This will permanently remove it from your inventory. This action cannot be undone."
        isPending={deletePartPending}
      />
    </div>
  );
};

export default AdminParts;
