import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreVertical, Mail, Phone, Wrench, Calendar,
  Filter, Download, X as XIcon, Lock, WrenchIcon,
  ChevronDown, ChevronUp, User, Car, IndianRupee, Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMechanicModal from '../../components/admin/AddMechanicModal';
import ChangePasswordModal from '../../components/admin/ChangePasswordModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useAdminMechanic } from '../../hooks/useAdminMechanic';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';
import SendNotificationModal from '../../components/admin/SendNotificationModal';
import { fetchMechanics } from '../../supabase/adminMechanic';


// Lazy-loaded jobs panel per mechanic
const MechanicJobsPanel = ({ mechanicId }) => {
  const { mechanicsJobs, mechanicsJobsPending } = useAdminMechanic(mechanicId);
  const jobs = mechanicsJobs || [];
  const totalRevenue = jobs.reduce((s, j) => s + (j.total_amount_full_service || 0), 0);

  if (mechanicsJobsPending) {
    return (
      <tr><td colSpan="6" className="px-8 py-6 bg-slate-50">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Loading job history...
        </div>
      </td></tr>
    );
  }

  return (
    <tr>
      <td colSpan="6" className="bg-slate-50/70 border-t border-dashed border-slate-200">
        <div className="px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-blue-500" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer Job History</p>
            <span className="ml-auto text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
          </div>

          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400 font-medium py-4 text-center">No jobs assigned to this mechanic yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] text-[10px] font-black text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100 mb-2">
                <span>Customer</span>
                <span>Vehicle</span>
                <span>Service Type</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="space-y-1">
                {jobs.map((job) => (
                  <div key={job.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] items-center py-2 px-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <User size={12} className="text-gray-300 shrink-0" />
                      {job.customers?.customer_details?.name || '—'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Car size={12} className="text-gray-300 shrink-0" />
                      {job.customers?.vehicle_details?.model || '—'}
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded w-fit">
                      {job.job_info?.service_type || 'General'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {job.service_date ? new Date(job.service_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                    <span className="text-xs font-black text-gray-900 text-right">
                      ₹{Number(job.total_amount_full_service || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-black text-gray-500">Lifetime Revenue: <span className="text-green-600">₹{totalRevenue.toLocaleString()}</span></p>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const AdminMechanics = () => {
  const navigate = useNavigate();
  const { mechanics, mechanicsPending, adminDeleteMechanic, adminDeleteMechanicPending } = useAdminMechanic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);


  const handleEdit = (mechanic) => {
    setSelectedMechanic(mechanic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMechanic(null);
  };

  const handleAddNew = () => {
    setSelectedMechanic(null);
    setIsModalOpen(true);
  };

  const handleChangePassword = (mechanic) => {
    setSelectedMechanic(mechanic);
    setIsPasswordModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (mechanic) => {
    setSelectedMechanic(mechanic);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMechanic) return;
    try {
      await adminDeleteMechanic(selectedMechanic.id);
      setIsDeleteModalOpen(false);
      setSelectedMechanic(null);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleJobsHistory = (mechanic) => {
    navigate(`/admin/mechanics/${mechanic.id}`);
    setActiveDropdown(null);
  };

  const handleSendNotification = (mechanic) => {
    setSelectedMechanic(mechanic);
    setIsNotificationModalOpen(true);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const filteredMechanics = (mechanics || []).filter(mechanic =>
    mechanic.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mechanic.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    currentData,
    onPageChange,
    totalResults
  } = usePagination(filteredMechanics, 10);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight">Mechanics Management</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage your team of skilled professionals.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-2 bg-[#2b5ae3] text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <Plus size={18} />
          Add New Mechanic
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-2 sm:p-3 rounded-md border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email or specialization..."
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

      {/* Mechanics Table/List */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-32">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Mechanic</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden xl:table-cell">Contact Info</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Role</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden 2xl:table-cell">Address</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Action</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Jobs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mechanicsPending ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading mechanics...
                    </div>
                  </td>
                </tr>
              ) : filteredMechanics.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No mechanics found.
                  </td>
                </tr>
              ) : (
                currentData.map((mechanic) => (
                  <React.Fragment key={mechanic.id}>
                    <tr
                      className="hover:bg-gray-50/50 transition-colors group text-sm cursor-pointer"
                      onClick={() => setExpandedId(expandedId === mechanic.id ? null : mechanic.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-sm uppercase">
                            {mechanic.full_name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-none">{mechanic.full_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={12} className="text-gray-400" />
                            <span className="text-xs font-medium">{mechanic.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={12} className="text-gray-400" />
                            <span className="text-xs font-medium">{mechanic.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[#2b5ae3] rounded-md w-fit border border-blue-100">
                          <Wrench size={10} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{mechanic.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden 2xl:table-cell">
                        <span className="text-xs text-gray-500 font-medium">{mechanic.address || 'No address provided'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                      <button
                            onClick={() => handleEdit(mechanic)}
                            className="px-3 py-1.5 text-xs font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-blue-100"
                          >
                            Edit
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === mechanic.id ? null : mechanic.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeDropdown === mechanic.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                                <button onClick={() => handleChangePassword(mechanic)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                                  <Lock size={14} className="text-gray-400" /> Change Password
                                </button>
                                <button onClick={() => handleJobsHistory(mechanic)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                                  <WrenchIcon size={14} className="text-gray-400" /> Jobs History
                                </button>
                                <button onClick={() => handleSendNotification(mechanic)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                                  <Bell size={14} className="text-gray-400" /> Send Notification
                                </button>

                                <button onClick={() => handleDeleteClick(mechanic)} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                                  <XIcon size={14} /> Delete Mechanic
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedId(expandedId === mechanic.id ? null : mechanic.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                          title="Toggle job history"
                        >
                          {expandedId === mechanic.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === mechanic.id && (
                      <MechanicJobsPanel mechanicId={mechanic.id} />
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden divide-y divide-gray-50">
          {mechanicsPending ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Loading mechanics...
              </div>
            </div>
          ) : currentData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No mechanics found.
            </div>
          ) : (
            currentData.map((mechanic) => (
              <div key={mechanic.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-[#2b5ae3] flex items-center justify-center font-bold text-base uppercase">
                      {mechanic.full_name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{mechanic.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[#2b5ae3] rounded text-[10px] font-bold border border-blue-100 uppercase">
                          <Wrench size={8} />
                          {mechanic.role}
                        </div>
                        <div className="flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100">
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === mechanic.id ? null : mechanic.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === mechanic.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                        <button
                          onClick={() => handleEdit(mechanic)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleChangePassword(mechanic)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Lock size={14} className="text-gray-400" />
                          Change Password
                        </button>
                        <button
                          onClick={() => handleSendNotification(mechanic)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Bell size={14} className="text-gray-400" />
                          Send Notification
                        </button>
                        <button
                          onClick={() => handleDeleteClick(mechanic)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <XIcon size={14} />
                          Delete Mechanic
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-xs font-medium truncate">{mechanic.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-xs font-medium">{mechanic.phone || 'N/A'}</span>
                  </div>
                </div>

                {mechanic.address && (
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md italic">
                    {mechanic.address}
                  </div>
                )}
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
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddMechanicModal
            onClose={handleCloseModal}
            editData={selectedMechanic}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPasswordModalOpen && (
          <ChangePasswordModal
            onClose={() => setIsPasswordModalOpen(false)}
            mechanic={selectedMechanic}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Mechanic"
        message={`Are you sure you want to delete ${selectedMechanic?.full_name}? This will permanently remove their access.`}
        confirmText="Delete"
        isLoading={adminDeleteMechanicPending}
      />

      <AnimatePresence>
        {isNotificationModalOpen && (
          <SendNotificationModal
            onClose={() => setIsNotificationModalOpen(false)}
            mechanics={mechanics}
            selectedMechanicId={selectedMechanic?.id}
          />
        )}
      </AnimatePresence>
    </div>

  );
};

export default AdminMechanics;
