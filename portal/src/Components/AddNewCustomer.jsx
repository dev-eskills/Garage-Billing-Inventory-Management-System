// components/AddCustomerModal.jsx
import React, { useState } from "react";
import { User, Car, X, Plus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast"; // <-- import toast

const AddNewCustomer = ({ onCustomerAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customer_details: {
      full_name: "",
      address: "",
      contact: { email: "", phone: "" },
    },
    vehicle_details: { model: "", vehicle_number: "" },
  });

  const { user } = useAuth();
  const mechanicId = user?.id || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("customer_")) {
      const key = name.replace("customer_", "");
      if (key === "email" || key === "phone") {
        setCustomerInfo({
          ...customerInfo,
          customer_details: {
            ...customerInfo.customer_details,
            contact: { ...customerInfo.customer_details.contact, [key]: value },
          },
        });
      } else {
        setCustomerInfo({
          ...customerInfo,
          customer_details: { ...customerInfo.customer_details, [key]: value },
        });
      }
    } else if (name.startsWith("vehicle_")) {
      const key = name.replace("vehicle_", "");
      setCustomerInfo({
        ...customerInfo,
        vehicle_details: { ...customerInfo.vehicle_details, [key]: value },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([{ ...customerInfo, mechanic_id: mechanicId }])
        .select("*");

      if (error) throw error;

      toast.success("Customer added successfully!"); // success toast
      onCustomerAdded?.(data[0]);
      setOpen(false);
      setCustomerInfo({
        customer_details: {
          full_name: "",
          address: "",
          contact: { email: "", phone: "" },
        },
        vehicle_details: { model: "", vehicle_number: "" },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add customer"); // error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold shadow flex items-center gap-2"
      >
        <Plus size={16} /> Add Customer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <User className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Add New Customer</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in customer and vehicle details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-h-[75vh] overflow-y-auto"
            >
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <User size={20} /> Customer Info
                </h3>

                <div>
                  <label className="block text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="customer_full_name"
                    value={customerInfo.customer_details.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="customer_address"
                    value={customerInfo.customer_details.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={customerInfo.customer_details.contact.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="customer_phone"
                      value={customerInfo.customer_details.contact.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Car size={20} /> Vehicle Info
                </h3>

                <div>
                  <label className="block text-gray-700">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={customerInfo.vehicle_details.model}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicle_vehicle_number"
                    value={customerInfo.vehicle_details.vehicle_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="lg:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {loading ? "Adding..." : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewCustomer;
