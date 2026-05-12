import React, { useState } from "react";
import {
  User,
  Phone,
  Car,
  Tag,
  ArrowLeft,
  Loader2,
  PlusCircle,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCustomers } from "../../hooks/useCustomers";
import { toast } from "react-hot-toast";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCustomer, createCustomerPending } = useCustomers(user?.id);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    model: "",
    vehicle_number: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to create a customer.");
      return;
    }
    try {
      await createCustomer({
        ...formData,
        mechanic_id: user.id
      });
      navigate("/mechanic/customers");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition mb-4 text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Customer</h1>
            <p className="text-slate-500 mt-2 font-medium">Add a new customer and their vehicle details to the system.</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <PlusCircle size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={18} className="text-blue-600" />
                <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Customer Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Tony Stark"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      name="contact"
                      required
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Car size={18} className="text-blue-600" />
                <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Vehicle Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Vehicle Model
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="model"
                      required
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. Audi R8 Spyder"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Vehicle Number
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="vehicle_number"
                      required
                      value={formData.vehicle_number}
                      onChange={handleChange}
                      placeholder="e.g. STARK-4"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-semibold uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCustomerPending}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer disabled:opacity-50"
            >
              {createCustomerPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
