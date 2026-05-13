import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  TrendingDown, 
  AlertCircle, 
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLosses } from '../../hooks/useLosses';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';

const AdminLosses = () => {
  const { 
    losses, 
    lossesLoading, 
    createLoss, 
    createLossPending, 
    removeLoss, 
    deleteLossPending 
  } = useLosses();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLoss, setSelectedLoss] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    loss_date: new Date().toISOString().split('T')[0],
    type: 'Defective Part'
  });

  const handleAddLoss = async (e) => {
    e.preventDefault();
    createLoss(formData, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFormData({
          description: '',
          amount: '',
          loss_date: new Date().toISOString().split('T')[0],
          type: 'Defective Part'
        });
      }
    });
  };

  const handleDeleteClick = (loss) => {
    setSelectedLoss(loss);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLoss) {
      removeLoss(selectedLoss.id, {
        onSuccess: () => setIsDeleteModalOpen(false)
      });
    }
  };

  const filteredLosses = (losses || []).filter(l => 
    l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    currentData,
    onPageChange,
    totalResults
  } = usePagination(filteredLosses, 10);

  const totalLossAmount = filteredLosses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Loss Management</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Track financial losses from returns, defective parts, and other scenarios.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-md font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100 hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <Plus size={18} />
          Report New Loss
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Losses</p>
              <h4 className="text-2xl font-black text-gray-900 mt-1">₹ {totalLossAmount.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Loss Count</p>
              <h4 className="text-2xl font-black text-gray-900 mt-1">{filteredLosses.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search losses..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {lossesLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-gray-500">Loading losses...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Date</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Description</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Type</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Amount</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLosses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <TrendingDown size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">No loss records found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((loss) => (
                    <tr key={loss.id} className="hover:bg-red-50/10 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(loss.loss_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{loss.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                          {loss.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-red-600">
                        ₹ {Number(loss.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteClick(loss)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={totalResults}
          pageSize={10}
        />
      </div>

      {/* Add Loss Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-[101] overflow-hidden"
            >
              <div className="bg-red-600 p-6 text-white">
                <h4 className="text-xl font-bold">Report New Loss</h4>
                <p className="text-red-100 text-sm mt-1">Provide details about the financial loss.</p>
              </div>

              <form onSubmit={handleAddLoss} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Loss Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                    <textarea
                      required
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm min-h-[100px]"
                      placeholder="e.g., Defective engine part returned to vendor but refund denied"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        required
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                        value={formData.loss_date}
                        onChange={(e) => setFormData({ ...formData, loss_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Loss Type</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Defective Part">Defective Part</option>
                    <option value="Return Reject">Return Reject</option>
                    <option value="Damage">Damage</option>
                    <option value="Theft">Theft</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-100 text-gray-600 rounded-md font-bold hover:bg-gray-50 transition-all text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLossPending}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {createLossPending ? 'Saving...' : 'Save Loss'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Loss Record"
        message="Are you sure you want to delete this loss record? This action will affect your accounting balance."
        confirmText="Delete"
        isLoading={deleteLossPending}
      />
    </div>
  );
};

export default AdminLosses;
