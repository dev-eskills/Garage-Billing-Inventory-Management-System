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
    Trash2,
    Edit,
    Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminVendor } from '../../hooks/useAdminVendor';
import AddVendorModal from '../../components/admin/AddVendorModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminVendors = () => {
    const {
        vendors, vendorsPending,
        adminDeleteVendor, adminDeleteVendorPending,
        vendorWithParts
    } = useAdminVendor();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleAddNew = () => {
        setSelectedVendor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleDeleteClick = (vendor) => {
        setSelectedVendor(vendor);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedVendor) return;
        try {
            await adminDeleteVendor(selectedVendor.id);
            setIsDeleteModalOpen(false);
            setSelectedVendor(null);
        } catch (err) {
            // Error handled by hook
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeDropdown]);

    const displayVendors = vendorWithParts || vendors || [];
    const filteredVendors = displayVendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.phone?.toLowerCase().includes(searchQuery.toLowerCase())
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
                        placeholder="Search by vendor name, email or phone..."
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
            <div className="bg-white rounded-md border border-gray-100 shadow-sm w-full min-h-[300px]">
                {vendorsPending ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold">Fetching vendors...</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-32">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Vendor</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden xl:table-cell">Contact Info</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Supplied Parts</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden 2xl:table-cell">Location</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredVendors.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                                                No vendors found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase">
                                                            {vendor.name?.charAt(0) || 'V'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-none">{vendor.name}</p>
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
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                                                            {vendor.parts && vendor.parts.length > 0 ? (
                                                                vendor.parts.map((part, idx) => (
                                                                    <div key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded shadow-sm text-[10px] font-bold text-gray-700 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                                                        <Package size={10} className="text-blue-500" />
                                                                        <span>{part.part_name}</span>
                                                                        <span className={`px-1 rounded-sm min-w-[20px] text-center ${part.stock_quantity <= 5 ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                                            {part.stock_quantity}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-400 text-[11px] italic font-medium">Catalog empty</span>
                                                            )}
                                                        </div>
                                                        {vendor.parts?.length > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-px bg-gray-100 flex-1"></div>
                                                                <span className="text-[9px] text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                                    {vendor.parts.length} {vendor.parts.length === 1 ? 'Part' : 'Parts'} listed
                                                                </span>
                                                                <div className="h-px bg-gray-100 flex-px w-2"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight border bg-green-50 text-green-700 border-green-100`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500`}></span>
                                                        Active
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
                                                        <button
                                                            onClick={() => handleEdit(vendor)}
                                                            className="px-3 py-1.5 text-xs font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-blue-100 flex items-center gap-1.5"
                                                        >
                                                            <Edit size={14} />
                                                            Edit
                                                        </button>
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveDropdown(activeDropdown === vendor.id ? null : vendor.id);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-100 rounded-md transition-all text-gray-400 hover:text-gray-600 cursor-pointer"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                            {activeDropdown === vendor.id && (
                                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                                                                    <button
                                                                        onClick={() => handleEdit(vendor)}
                                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <Edit size={14} className="text-gray-400" />
                                                                        Update Info
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteClick(vendor)}
                                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <Trash2 size={14} />
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
                                <div className="p-8 text-center text-gray-500 font-bold">
                                    No vendors found.
                                </div>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <div key={vendor.id} className="p-4 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-base uppercase">
                                                    {vendor.name?.charAt(0) || 'V'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{vendor.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <div className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border bg-green-50 text-green-700 border-green-100`}>
                                                            Active
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
                                                        <button
                                                            onClick={() => handleEdit(vendor)}
                                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit size={14} className="text-gray-400" />
                                                            Edit Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(vendor)}
                                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} />
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

                                        {/* Parts List Mobile */}
                                        <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                                            <div className="flex items-center justify-between mb-2.5">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Store size={12} className="text-[#2b5ae3]" />
                                                    Inventory Catalog
                                                </p>
                                                {vendor.parts?.length > 0 && (
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">
                                                        {vendor.parts.length} {vendor.parts.length === 1 ? 'Item' : 'Items'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {vendor.parts && vendor.parts.length > 0 ? (
                                                    vendor.parts.map((part, idx) => (
                                                        <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded shadow-sm text-[10px] font-bold text-gray-700">
                                                            <Package size={10} className="text-blue-500" />
                                                            <span>{part.part_name}</span>
                                                            <span className={`px-1 rounded-sm min-w-[18px] text-center ${part.stock_quantity <= 5 ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                                {part.stock_quantity}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-[10px] italic">No inventory listed</span>
                                                )}
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
                    </>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddVendorModal
                        onClose={() => setIsModalOpen(false)}
                        editData={selectedVendor}
                    />
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Vendor"
                message={`Are you sure you want to delete ${selectedVendor?.name}? This will remove them from your active vendors list.`}
                confirmText="Delete"
                isLoading={adminDeleteVendorPending}
            />
        </div>
    );
};

export default AdminVendors;