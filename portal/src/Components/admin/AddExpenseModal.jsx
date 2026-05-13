import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar, FileText, Tag, Loader2, ShieldCheck } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { toast } from 'react-hot-toast';

const AddExpenseModal = ({ onClose, editData = null }) => {
  const isEdit = !!editData;
  const { 
    addExpense, addExpensePending, 
    updateExpense, updateExpensePending,
    categories, addCategory
  } = useExpenses();

  const [formData, setFormData] = useState({
    category_id: editData?.category_id || '',
    customCategoryName: '',
    amount: editData?.amount || '',
    expense_date: editData?.expense_date ? new Date(editData.expense_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: editData?.description || ''
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category_select') {
      if (value === 'CUSTOM') {
        setIsCustomCategory(true);
        setFormData(prev => ({ ...prev, category_id: '', customCategoryName: '' }));
      } else {
        setIsCustomCategory(false);
        setFormData(prev => ({ ...prev, category_id: value, customCategoryName: '' }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalCategoryId = formData.category_id;

      if (isCustomCategory && formData.customCategoryName) {
        const newCat = await addCategory(formData.customCategoryName);
        finalCategoryId = newCat.id;
      }

      if (!finalCategoryId) {
        toast.error('Please select or create a category');
        return;
      }

      const payload = {
        category_id: finalCategoryId,
        amount: parseFloat(formData.amount),
        expense_date: new Date(formData.expense_date).toISOString(),
        description: formData.description
      };

      if (isEdit) {
        await updateExpense({ id: editData.id, expenseData: payload });
      } else {
        await addExpense(payload);
      }
      onClose();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const isPending = addExpensePending || updateExpensePending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-md shadow-2xl flex flex-col z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#2b5ae3] px-4 py-6 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white cursor-pointer z-10"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <DollarSign size={32} className="text-white" />
          </div>
          <h4 className="text-xl font-bold tracking-tight text-center">
            {isEdit ? 'Update Expense' : 'Add New Expense'}
          </h4>
          <p className="text-blue-100 font-medium mt-1 text-center text-xs px-4">
            {isEdit ? 'Modify the details of this expense record.' : 'Record a new operating or miscellaneous expense.'}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Expense Category
                </label>
                {isCustomCategory && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsCustomCategory(false);
                      setFormData(prev => ({ ...prev, category_id: categories.length > 0 ? categories[0].id : '' }));
                    }}
                    className="text-[10px] text-[#2b5ae3] font-bold hover:underline"
                  >
                    Select Existing
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Tag size={16} className="text-gray-400" />
                </div>
                {!isCustomCategory ? (
                  <select
                    name="category_select"
                    required
                    value={formData.category_id}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none"
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="CUSTOM" className="font-bold text-[#2b5ae3]">+ Create New Category</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name="customCategoryName"
                    required
                    value={formData.customCategoryName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    placeholder="e.g. Workshop Repairs"
                  />
                )}
              </div>
            </div>

            {/* Amount & Date Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold">₹</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                    placeholder="0.00"
                    disabled={editData?.expense_categories?.name === 'Parts Purchase'}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="expense_date"
                    required
                    value={formData.expense_date}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                Description / Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium custom-scrollbar"
                  placeholder="Optional details about this expense..."
                ></textarea>
              </div>
            </div>

            {editData?.expense_categories?.name === 'Parts Purchase' && (
              <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 font-medium border border-blue-100">
                Note: This is an automatically generated expense from a parts purchase. You can edit the date and description, but the category and amount should remain tied to the purchase.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-md font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-[#2b5ae3] text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {isEdit ? 'Update Expense' : 'Save Expense'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpenseModal;
