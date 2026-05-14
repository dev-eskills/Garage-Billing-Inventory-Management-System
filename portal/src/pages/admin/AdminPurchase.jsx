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
    Package,
    Store,
    TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminPurchase } from '../../hooks/useAdminPurchase';
import { useLosses } from '../../hooks/useLosses';
import { useParts } from '../../hooks/useParts';
import { usePagination } from '../../hooks/usePagination';
import AddPurchaseModal from '../../Components/admin/AddPurchaseModal';
import ReturnPartsModal from '../../Components/admin/ReturnPartsModal';
import ConfirmationModal from '../../Components/common/ConfirmationModal';
import Pagination from '../../Components/common/Pagination';

const AdminPurchase = () => {
    const {
        purchases, purchasesPending,
        updatePurchaseStatus, updateStatusPending,
        deletePurchase, deletePurchasePending
    } = useAdminPurchase();

    const { createLoss, createLossPending } = useLosses();
    const { decreasePartStock } = useParts();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
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
        const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
        await updatePurchaseStatus({ id, status: newStatus });
        setActiveDropdown(null);
    };

    const handleMarkAsLoss = (purchase) => {
        setSelectedPurchase(purchase);
        setIsReturnModalOpen(true);
        setActiveDropdown(null);
    };

    const handleConfirmReturn = async (quantity, totalLoss) => {
        if (!selectedPurchase) return;

        const lossData = {
            description: `Defective part return: ${selectedPurchase.parts?.part_name} (${quantity} units) from ${selectedPurchase.vendors?.name}`,
            amount: totalLoss,
            loss_date: new Date().toISOString().split('T')[0],
            type: 'Defective Part',
            purchase_id: selectedPurchase.id,
        };

        try {
            await createLoss(lossData);
            if (selectedPurchase.part_id) {
                await decreasePartStock(selectedPurchase.part_id, quantity);
            }
            setIsReturnModalOpen(false);
            setSelectedPurchase(null);
        } catch (err) {
            console.error('Failed to process return:', err);
        }
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
        p.parts?.part_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.total_amount?.toString().includes(searchQuery)
    )
        .sort((a, b) => {
            // 1. Primary Sort: Date (Newest date first)
            const dateCompare = new Date(b.purchase_date) - new Date(a.purchase_date);
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
    const {
        currentPage,
        totalPages,
        currentData,
        onPageChange,
        totalResults
    } = usePagination(filteredPurchases, 10);

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
                        ₹ {(purchases || []).filter(p => p.payment_status === 'Paid').reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0).toLocaleString()}
                    </h4>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                    <p className="text-orange-600 text-xs font-bold uppercase tracking-wider">Pending Payments</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">
                        ₹ {(purchases || []).filter(p => p.payment_status === 'Pending').reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0).toLocaleString()}
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
                ) : <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Purchase Date</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Vendor Info</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Part Details</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Total Amount</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                                            No purchase records found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(purchase.purchase_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{purchase.vendors?.name || 'Unknown Vendor'}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">{purchase.vendors?.email || 'No email'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        {/* <Package size={14} className="text-blue-500" /> */}
                                                        <img className="w-10 h-10 rounded-full" src={purchase?.parts?.image_url} alt="" />
                                                        <span className="font-bold text-gray-900">{purchase.parts?.part_name || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1 rounded uppercase tracking-tighter">QTY: {purchase.quantity}</span>
                                                        <span className="text-[10px] text-gray-400">@ ₹{purchase.unit_price || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-gray-900">₹ {Number(purchase.total_amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border ${purchase.payment_status === 'Paid'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                    {purchase.payment_status === 'Paid' ? (
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
                                                                {purchase.payment_status === 'Paid' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                                                                Mark as {purchase.payment_status === 'Paid' ? 'Pending' : 'Paid'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAsLoss(purchase)}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <TrendingDown size={14} />
                                                                Mark as Loss
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(purchase)}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete Purchase
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

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-50">
                        {currentData.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-bold">
                                No purchase records found.
                            </div>
                        ) : (
                            currentData.map((purchase) => (
                                <div key={purchase.id} className="p-4 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Calendar size={14} />
                                                {new Date(purchase.purchase_date).toLocaleDateString()}
                                            </div>
                                            <h5 className="font-bold text-gray-900">{purchase.vendors?.name}</h5>
                                            <p className="text-[10px] text-gray-500">{purchase.vendors?.email}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === purchase.id ? null : purchase.id);
                                                }}
                                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {activeDropdown === purchase.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 text-left">
                                                    <button
                                                        onClick={() => handleStatusUpdate(purchase.id, purchase.payment_status)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        {purchase.payment_status === 'Paid' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                                                        Mark as {purchase.payment_status === 'Paid' ? 'Pending' : 'Paid'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleMarkAsLoss(purchase)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                                    >
                                                        <TrendingDown size={14} />
                                                        Mark as Loss
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(purchase)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete Purchase
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-[#2b5ae3]" />
                                            <span className="text-sm font-bold text-gray-900">{purchase.parts?.part_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-600">
                                            <span>Quantity: <span className="text-gray-900">{purchase.quantity}</span></span>
                                            <span>Unit Price: <span className="text-gray-900">₹{purchase.unit_price}</span></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${purchase.payment_status === 'Paid'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                            {purchase.payment_status}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                                            <p className="text-sm font-bold text-[#2b5ae3]">₹ {Number(purchase.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        totalResults={totalResults}
                        pageSize={10}
                    />
                </>
                }
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddPurchaseModal
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            <ReturnPartsModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                onConfirm={handleConfirmReturn}
                purchase={selectedPurchase}
                isPending={createLossPending}
            />

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