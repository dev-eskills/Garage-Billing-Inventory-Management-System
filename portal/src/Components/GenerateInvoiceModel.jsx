import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useInvoice } from "../hooks/useInvoice";

const GenerateInvoiceModel = () => {
  const [open, setOpen] = useState(false);
  const { loading, error, createInvoice } = useInvoice();

  // State to hold invoice form data
  const [invoiceForm, setInvoiceForm] = useState({
    customerName: "",
    customerPhone: "",
    vehicleName: "",
    vehicleNumber: "",
    serviceType: "",
    serviceDate: "",
    status: "Pending",
    parts: [{ name: "", qty: 1, price: 0 }],
    tax: 0,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle part changes
  const handlePartChange = (index, field, value) => {
    const newParts = [...invoiceForm.parts];
    newParts[index][field] =
      field === "qty" || field === "price" ? Number(value) : value;
    setInvoiceForm((prev) => ({ ...prev, parts: newParts }));
  };

  // Add new part
  const addPart = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      parts: [...prev.parts, { name: "", qty: 1, price: 0 }],
    }));
  };

  // Remove part
  const removePart = (index) => {
    const newParts = invoiceForm.parts.filter((_, i) => i !== index);
    setInvoiceForm((prev) => ({ ...prev, parts: newParts }));
  };

  // Calculate totals
  const subtotal = invoiceForm.parts.reduce(
    (acc, p) => acc + p.qty * p.price,
    0,
  );
  const total = subtotal + Number(invoiceForm.tax || 0);

  // Submit invoice
  const handleSubmit = async (e) => {
    e.preventDefault();

    const invoicePayload = {
      customer_name: invoiceForm.customerName,
      customer_phone: invoiceForm.customerPhone,
      vehicle_name: invoiceForm.vehicleName,
      vehicle_number: invoiceForm.vehicleNumber,
      service_type: invoiceForm.serviceType,
      service_date: invoiceForm.serviceDate,
      status: invoiceForm.status,
      tax: Number(invoiceForm.tax || 0),
      subtotal,
      total,
      items: invoiceForm.parts.map((part) => ({
        name: part.name,
        qty: part.qty,
        price: part.price,
        total: part.qty * part.price,
      })),
    };

    const result = await createInvoice(invoicePayload);

    if (result.success) {
      alert("Invoice generated successfully!");
      setInvoiceForm({
        customerName: "",
        customerPhone: "",
        vehicleName: "",
        vehicleNumber: "",
        serviceType: "",
        serviceDate: "",
        status: "Pending",
        parts: [{ name: "", qty: 1, price: 0 }],
        tax: 0,
      });
      setOpen(false);
    } else {
      alert("Failed to generate invoice: " + result.error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 w-full bg-black text-white hover:bg-gray-900 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300"
      >
        Generate Invoice
        <ArrowRight size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-auto max-h-[90vh] relative p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="customerName"
                  value={invoiceForm.customerName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Customer Name"
                  className="border p-2 rounded-lg w-full"
                />
                <input
                  name="customerPhone"
                  value={invoiceForm.customerPhone}
                  onChange={handleChange}
                  type="text"
                  placeholder="Customer Phone"
                  className="border p-2 rounded-lg w-full"
                />
                <input
                  name="vehicleName"
                  value={invoiceForm.vehicleName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Vehicle Name"
                  className="border p-2 rounded-lg w-full"
                />
                <input
                  name="vehicleNumber"
                  value={invoiceForm.vehicleNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Vehicle Number"
                  className="border p-2 rounded-lg w-full"
                />
                <input
                  name="serviceType"
                  value={invoiceForm.serviceType}
                  onChange={handleChange}
                  type="text"
                  placeholder="Service Type"
                  className="border p-2 rounded-lg w-full"
                />
                <input
                  name="serviceDate"
                  value={invoiceForm.serviceDate}
                  onChange={handleChange}
                  type="date"
                  className="border p-2 rounded-lg w-full"
                />
                <select
                  name="status"
                  value={invoiceForm.status}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">Invoice Parts</h3>
                  <button
                    type="button"
                    onClick={addPart}
                    className="text-sm bg-slate-900 text-white px-3 py-2 rounded-lg"
                  >
                    Add Part
                  </button>
                </div>

                {invoiceForm.parts.map((part, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
                  >
                    <input
                      value={part.name}
                      onChange={(e) =>
                        handlePartChange(index, "name", e.target.value)
                      }
                      type="text"
                      placeholder="Part Name"
                      className="border p-2 rounded-lg w-full"
                    />
                    <input
                      value={part.qty}
                      onChange={(e) =>
                        handlePartChange(index, "qty", e.target.value)
                      }
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      className="border p-2 rounded-lg w-full"
                    />
                    <input
                      value={part.price}
                      onChange={(e) =>
                        handlePartChange(index, "price", e.target.value)
                      }
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      className="border p-2 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="bg-red-500 text-white rounded-lg px-3 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-3xl bg-slate-50">
                  <label className="block text-sm font-medium mb-2">
                    Tax Amount
                  </label>
                  <input
                    name="tax"
                    value={invoiceForm.tax}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Tax"
                    className="border p-2 rounded-lg w-full"
                  />
                </div>
                <div className="border p-4 rounded-3xl bg-slate-50">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving Invoice..." : "Generate Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateInvoiceModel;
