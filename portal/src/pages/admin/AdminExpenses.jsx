import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Plus, Search, Filter, Trash2, Edit, Calendar, Tag, FileText } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import AddExpenseModal from '../../components/admin/AddExpenseModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { syncHistoricalPurchases } from '../../supabase/syncPurchases';
import { useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';

const AdminExpenses = () => {
  const queryClient = useQueryClient();
  const { expenses, expensesPending, deleteExpense, deleteExpensePending } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    const query = searchQuery.toLowerCase();
    return expenses.filter(exp => 
      (exp.expense_categories?.name || '').toLowerCase().includes(query) ||
      (exp.description && exp.description.toLowerCase().includes(query))
    );
  }, [expenses, searchQuery]);

  const {
    currentPage,
    totalPages,
    currentData,
    onPageChange,
    totalResults
  } = usePagination(filteredExpenses, 10);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [filteredExpenses]);

  const toggleRow = (id) => {
    setExpandedRowId(prev => prev === id ? null : id);
  };

  const handleAddNew = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setExpenseToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const handleSync = async () => {
    await syncHistoricalPurchases();
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Expenses Tracking</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage operational costs and parts purchases.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            className="inline-flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-md font-bold hover:bg-purple-100 transition-all cursor-pointer text-sm"
          >
            Sync Old Purchases
          </button>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <Plus size={18} />
            Add New Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <DollarSign size={24} className="text-[#2b5ae3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Filtered Expenses</p>
            <h4 className="text-2xl font-black text-gray-900 tracking-tight">₹ {totalExpenses.toLocaleString()}</h4>
          </div>
        </div>
        {/* More summary cards could go here based on categories */}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search expenses by category or description..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-md font-bold border border-gray-100 hover:bg-gray-100 transition-all text-xs cursor-pointer">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Date</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Category</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Description</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 text-right">Amount</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expensesPending ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                currentData.map((exp) => (
                  <React.Fragment key={exp.id}>
                    <tr 
                      className={`hover:bg-gray-50/50 transition-colors text-sm ${exp.expense_categories?.name === 'Parts Purchase' ? 'cursor-pointer' : ''}`}
                      onClick={() => exp.expense_categories?.name === 'Parts Purchase' && toggleRow(exp.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium">{new Date(exp.expense_date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          exp.expense_categories?.name === 'Parts Purchase' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          <Tag size={12} />
                          {exp.expense_categories?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 max-w-xs truncate text-gray-600">
                          <FileText size={14} className="text-gray-400 shrink-0 mt-0.5" />
                          <span className="truncate">{exp.description || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold text-gray-900 text-base">₹ {Number(exp.amount).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}
                            className="px-3 py-1.5 text-xs font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(exp.id); }}
                            disabled={deleteExpensePending}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
                            title="Delete Expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRowId === exp.id && exp.expense_categories?.name === 'Parts Purchase' && (
                      <tr className="bg-purple-50/30 border-b border-gray-100">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="pl-6 sm:pl-8 border-l-2 border-purple-300 ml-2">
                            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <DollarSign size={14} className="text-purple-600" />
                              Purchase Details
                            </h5>
                            
                            {!exp.purchases ? (
                              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                                No purchase details linked. Please click the <strong>Sync Old Purchases</strong> button at the top to relink historical records.
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                <div>
                                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Vendor Name</span>
                                  <span className="text-sm font-medium text-gray-900">{exp.purchases.vendors?.name || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Part Name (SKU)</span>
                                  <span className="text-sm font-medium text-gray-900">{exp.purchases.parts?.part_name || 'N/A'} {exp.purchases.parts?.sku ? `(${exp.purchases.parts.sku})` : ''}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Quantity</span>
                                  <span className="text-sm font-bold text-gray-900">{exp.purchases.quantity}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Per Part Price</span>
                                  <span className="text-sm font-medium text-gray-900">₹ {Number(exp.purchases.unit_price || 0).toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Payment Status</span>
                                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                                    exp.purchases.payment_status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                  }`}>
                                    {exp.purchases.payment_status || 'Pending'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={totalResults}
          pageSize={10}
        />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddExpenseModal
            onClose={() => setIsModalOpen(false)}
            editData={selectedExpense}
          />
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        isPending={deleteExpensePending}
      />
    </div>
  );
};

export default AdminExpenses;
