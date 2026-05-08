import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Hash, Tag, Layers, DollarSign, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useParts } from '../../hooks/useParts';
import { useAdminVendor } from '../../hooks/useAdminVendor';
import { uploadPartImage } from '../../supabase/parts';
import { toast } from 'react-hot-toast';
import { Image as ImageIcon, User } from 'lucide-react';

const AddPartModal = ({ onClose, editData = null }) => {
  const isEdit = !!editData;
  const { vendors } = useAdminVendor();
  const {
    addPart, addPartPending,
    updatePart, updatePartPending
  } = useParts();

  const [formData, setFormData] = useState({
    part_name: editData?.part_name || '',
    sku: editData?.sku || '',
    category: editData?.category || '',
    stock_quantity: editData?.stock_quantity || '',
    unit_price: editData?.unit_price || '',
    min_stock_level: editData?.min_stock_level || '',
    image_url: editData?.image_url || '',
    vendor_id: editData?.vendor_id || ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(editData?.image_url || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let currentImageUrl = formData.image_url;
      
      if (imageFile) {
        currentImageUrl = await uploadPartImage(imageFile);
      }

      const finalData = { ...formData, image_url: currentImageUrl };
      console.log(finalData);

      if (isEdit) {
        await updatePart({ id: editData.id, partData: finalData });
      } else {
        await addPart(finalData);
      }
      onClose();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    }
  };

  const isPending = addPartPending || updatePartPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-xl rounded-md shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden z-50"
      >
        {/* Header - Fixed at top */}
        <div className="bg-[#2b5ae3] px-4 py-6 sm:px-6 sm:py-8 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white cursor-pointer z-10"
          >
            <X size={20} />
          </button>
          <div className="hidden sm:flex w-16 h-16 bg-white/10 rounded-full items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Package size={32} className="text-white" />
          </div>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
            {isEdit ? 'Update Part Details' : 'Add New Part'}
          </h4>
          <p className="text-blue-100 font-medium mt-1 text-center text-xs sm:text-sm px-4">
            {isEdit ? 'Modify the inventory part information.' : 'Add a new part to the garage inventory.'}
          </p>
        </div>

        {/* Form Content - Scrollable area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Part Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Part Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Package size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="part_name"
                    required
                    value={formData.part_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Brake Pads"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  SKU
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="BP-1029"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5 ">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Brakes"
                  />
                </div>
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Stock Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Layers size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="stock_quantity"
                    required
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Unit Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Unit Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="unit_price"
                    required
                    value={formData.unit_price}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="29.99"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Min Stock Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Min Stock Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AlertCircle size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="min_stock_level"
                    required
                    value={formData.min_stock_level}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="10"
                    min="0"
                  />
                </div>
              </div>

              {/* Vendor Selection */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Preferred Vendor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <select
                    name="vendor_id"
                    required
                    value={formData.vendor_id}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none"
                  >
                    <option value="">Select a vendor...</option>
                    {vendors?.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Part Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-md bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#2b5ae3] file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium leading-relaxed">Square image recommended, max 2MB.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-md font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm cursor-pointer order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2b5ae3] text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {isEdit ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {isEdit ? 'Update Part' : 'Add Part'}
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


export default AddPartModal;
