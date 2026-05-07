import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Wrench,
  Calendar,
  Filter,
  Download,
  X as XIcon,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMechanicModal from '../../components/admin/AddMechanicModal';
import ChangePasswordModal from '../../components/admin/ChangePasswordModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useAuth } from '../../hooks/useAuth';
import { useAdminMechanic } from '../../hooks/useAdminMechanic';

const AdminMechanics = () => {
  const { mechanics, mechanicsPending, adminDeleteMechanic, adminDeleteMechanicPending } = useAdminMechanic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

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
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Mechanic</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Contact Info</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Role</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50 hidden lg:table-cell">Address</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-50"></th>
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
                filteredMechanics.map((mechanic) => (
                  <tr key={mechanic.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
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
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <span className="text-xs">{mechanic.address || 'No address provided'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
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
                              <button
                                onClick={() => handleChangePassword(mechanic)}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Lock size={14} className="text-gray-400" />
                                Change Password
                              </button>
                              <button
                                onClick={() => handleDeleteClick(mechanic)}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                              >
                                <XIcon size={14} />
                                Delete Mechanic
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
          {mechanicsPending ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Loading mechanics...
              </div>
            </div>
          ) : filteredMechanics.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No mechanics found.
            </div>
          ) : (
            filteredMechanics.map((mechanic) => (
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
    </div>
  );
};

export default AdminMechanics;
