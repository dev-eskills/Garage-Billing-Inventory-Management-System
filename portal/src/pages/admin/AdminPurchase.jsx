import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Calendar,
    Filter,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminPurchase } from '../../hooks/useAdminPurchase';
import AddPurchaseModal from '../../components/admin/AddPurchaseModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminPurchase = () => {
    const {
        purchases, purchasesPending,
        updatePurchaseStatus, updateStatusPending,
        deletePurchase, deletePurchasePending
    } = useAdminPurchase();

    console.log(purchases);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleDeleteClick = (purchase) => {
        setSelectedPurchase(purchase);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedPurchase) return;
        try {
            await deletePurchase(selectedPurchase.id);
            setIsDeleteModalOpen(false);
            setSelectedPurchase(null);
        } catch (err) { }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        await updatePurchaseStatus({ id, status: newStatus });
        setActiveDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeDropdown]);

    const filteredPurchases = (purchases || []).filter(p =>
        p.vendors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.total_amount?.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Purchase Management</h3>
                    <p className="text-gray-500 font-medium text-sm mt-0.5">Track inventory acquisitions and vendor payments.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                    <Plus size={18} />
                    New Purchase
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Purchases</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{purchases?.length || 0}</h4>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                    <p className="text-green-600 text-xs font-bold uppercase tracking-wider">Total Paid</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">
                        ₹ {(purchases || []).filter(p => p.payment_status === 'paid').reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0).toLocaleString()}
                    </h4>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                    <p className="text-orange-600 text-xs font-bold uppercase tracking-wider">Pending Payments</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">
                        ₹ {(purchases || []).filter(p => p.payment_status === 'pending').reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0).toLocaleString()}
                    </h4>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by vendor or amount..."
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

            {/* Purchases Table */}
            <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden w-full min-h-[300px]">
                {purchasesPending ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold">Loading purchase records...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar pb-32">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Order Date</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Vendor</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Amount</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPurchases.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                                            No purchase records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPurchases.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(purchase.purchase_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-xs uppercase">
                                                        {purchase.vendors?.name?.charAt(0) || 'V'}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{purchase.vendors?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-gray-900">₹ {Number(purchase.total_amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border ${purchase.payment_status === 'paid'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                    {purchase.payment_status === 'paid' ? (
                                                        <CheckCircle2 size={12} className="mr-1.5" />
                                                    ) : (
                                                        <Clock size={12} className="mr-1.5" />
                                                    )}
                                                    {purchase.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdown(activeDropdown === purchase.id ? null : purchase.id);
                                                        }}
                                                        className="p-1.5 hover:bg-gray-100 rounded-md transition-all text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    {activeDropdown === purchase.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 text-left">
                                                            <button
                                                                onClick={() => handleStatusUpdate(purchase.id, purchase.payment_status)}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                                            >
                                                                {purchase.payment_status === 'paid' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                                                                Mark as {purchase.payment_status === 'paid' ? 'Pending' : 'Paid'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(purchase)}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete Order
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddPurchaseModal
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Purchase Record"
                message="Are you sure you want to delete this purchase record? This action cannot be undone."
                confirmText="Delete"
                isLoading={deletePurchasePending}
            />
        </div>
    );
};

export default AdminPurchase;