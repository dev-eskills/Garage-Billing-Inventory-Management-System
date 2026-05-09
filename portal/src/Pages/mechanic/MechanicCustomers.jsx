import React, { useState } from "react";
import {
  User,
  Phone,
  Car,
  Tag,
  Search,
  Edit2,
  Trash2,
  Plus,
  Loader2,
  X,
  Save,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCustomers } from "../../hooks/useCustomers";
import { motion, AnimatePresence } from "framer-motion";

const MechanicCustomers = () => {
  const { user } = useAuth();
  const {
    customers,
    customersLoading,
    updateCustomer,
    updateCustomerPending,
    deleteCustomer,
    deleteCustomerPending
  } = useCustomers(user?.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredCustomers = customers.filter(customer => {
    const details = customer.customer_details || {};
    const vehicle = customer.vehicle_details || {};
    const searchStr = searchTerm.toLowerCase();
    return (
      details.name?.toLowerCase().includes(searchStr) ||
      details.contact?.toLowerCase().includes(searchStr) ||
      vehicle.model?.toLowerCase().includes(searchStr) ||
      vehicle.vehicle_number?.toLowerCase().includes(searchStr)
    );
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      id: editingCustomer.id,
      name: formData.get('name'),
      contact: formData.get('contact'),
      model: formData.get('model'),
      vehicle_number: formData.get('vehicle_number'),
    };

    try {
      await updateCustomer(updateData);
      setEditingCustomer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsApp = (contact, name, vehicle) => {
    const message = encodeURIComponent(`Hello ${name}, regarding your ${vehicle}...`);
    window.open(`https://wa.me/${contact.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Customers</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage all customers and vehicles assigned to you.</p>
          </div>
          <Link
            to="/mechanic/create-customer"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition active:translate-y-0"
          >
            <Plus size={20} />
            Add New Customer
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, vehicle or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm font-medium"
          />
        </div>

        {/* Content */}
        {customersLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500 font-bold animate-pulse">Loading your customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <User size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No customers found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              {searchTerm ? "Try adjusting your search terms to find what you're looking for." : "Start by adding your first customer to the system."}
            </p>
            {!searchTerm && (
              <Link
                to="/mechanic/create-customer"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                Add Customer Now <Plus size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={customer.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight uppercase">
                        {customer.customer_details?.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                        <Phone size={12} />
                        <span className="text-xs font-bold">{customer.customer_details?.contact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(customer.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Car size={16} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 uppercase">{customer.vehicle_details?.model}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag size={16} className="text-slate-400" />
                    <span className="text-xs font-black text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                      {customer.vehicle_details?.vehicle_number}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleWhatsApp(
                      customer.customer_details?.contact,
                      customer.customer_details?.name,
                      customer.vehicle_details?.model
                    )}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                  <Link
                    to={`/mechanic/customers/${customer.id}`}
                    className="flex-1 flex items-center justify-center py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCustomer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Customer</h2>
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Full Name
                      </label>
                      <input
                        name="name"
                        defaultValue={editingCustomer.customer_details?.name}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Contact Number
                      </label>
                      <input
                        name="contact"
                        defaultValue={editingCustomer.customer_details?.contact}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Vehicle Model
                      </label>
                      <input
                        name="model"
                        defaultValue={editingCustomer.vehicle_details?.model}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Vehicle Number
                      </label>
                      <input
                        name="vehicle_number"
                        defaultValue={editingCustomer.vehicle_details?.vehicle_number}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="flex-1 py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateCustomerPending}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {updateCustomerPending ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Are you sure?</h2>
              <p className="text-slate-500 mb-8 font-medium">
                This action cannot be undone. All vehicle data associated with this customer will be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
                >
                  No, Keep it
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleteCustomerPending}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                >
                  {deleteCustomerPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MechanicCustomers;
