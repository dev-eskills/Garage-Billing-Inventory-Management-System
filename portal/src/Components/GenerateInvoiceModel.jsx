import React, { useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { generateAndSaveInvoice } from "../supabase/invoices";
import toast from "react-hot-toast";

const GenerateInvoiceModel = ({ jobDetails, disabled }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(jobDetails);

  const customer = jobDetails?.customers?.customer_details || {};
  const vehicle = jobDetails?.customers?.vehicle_details || {};
  const parts = jobDetails?.parts_items || [];
  const serviceInfo = jobDetails?.job_info || {};

  const subtotal = useMemo(() => {
    return parts.reduce((acc, p) => {
      const qty = Number(p.quantity || 0);
      const price = Number(p.unit_price || 0); // FIXED (was total_price incorrectly used)
      return acc + qty * price;
    }, 0);
  }, [parts]);

  const discountPercentage = Number(jobDetails?.discount_percentage || 0);

  const discount = useMemo(() => {
    return (subtotal * discountPercentage) / 100;
  }, [subtotal, discountPercentage]);

  const extraServiceAmount = useMemo(() => {
    return (
      jobDetails?.extra_service?.reduce((acc, item) => {
        return acc + (Number(item?.amount) || 0);
      }, 0) || 0
    );
  }, [jobDetails?.extra_service]);

  const total = useMemo(() => {
    return subtotal - discount + extraServiceAmount;
  }, [subtotal, discount, extraServiceAmount]);

  const handleGenerateInvoice = async () => {
    if (!jobDetails?.id || !jobDetails?.mechanic_id) return;

    try {
      setLoading(true);

      await generateAndSaveInvoice(jobDetails, jobDetails.mechanic_id);

      toast.success("Invoice generated successfully!");
      setOpen(false);
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      setError(err.message);
      toast.error("Already Created");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* OPEN BUTTON */}
      <button
        onClick={() => {
          if (disabled) return;
          setOpen(true);
        }}
        disabled={disabled}
        className={`mt-6 w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300
          ${
            disabled
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-black hover:bg-gray-900 text-white"
          }`}
      >
        Generate Invoice
        <ArrowRight size={18} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="no-scrollbar w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-auto relative p-6">
            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center"
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Invoice Preview</h2>
              <p className="text-sm text-gray-500">Review before generating</p>
            </div>

            {/* CONTENT */}
            <div className="space-y-6">
              {/* CUSTOMER + VEHICLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CUSTOMER */}
                <div className="border rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-semibold">
                    Customer Information
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      <TableRow label="Name" value={customer?.name} />
                      <TableRow label="Phone" value={customer?.contact} />
                    </tbody>
                  </table>
                </div>

                {/* VEHICLE */}
                <div className="border rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-semibold">
                    Vehicle Information
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      <TableRow label="Vehicle" value={vehicle?.model} />
                      <TableRow
                        label="Number"
                        value={vehicle?.vehicle_number}
                      />
                      <TableRow
                        label="Service"
                        value={serviceInfo?.service_type}
                      />
                      <TableRow label="Date" value={jobDetails?.service_date} />
                      <TableRow
                        label="Status"
                        value={
                          <span className="text-green-600 font-semibold">
                            {serviceInfo?.status}
                          </span>
                        }
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PARTS */}
              <div className="border rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 font-semibold">
                  Parts Details
                </div>

                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 text-left">Part</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {parts.map((p, i) => {
                      const qty = Number(p.quantity || 0);
                      const price = Number(p.unit_price || 0);

                      return (
                        <tr key={i} className="border-t">
                          <td className="p-3">{p.part_name}</td>
                          <td className="p-3 text-center">{qty}</td>
                          <td className="p-3 text-right">
                            ₹{price.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-medium">
                            ₹{(qty * price).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* EXTRA SERVICES */}
              {jobDetails?.extra_service?.length > 0 && (
                <div className="border rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-semibold">
                    Extra Services
                  </div>

                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 text-left">Service</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {jobDetails.extra_service.map((s, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{s?.description || "Service"}</td>
                          <td className="p-3 text-right font-medium">
                            ₹{Number(s?.amount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUMMARY */}
              <div className="border rounded-2xl p-4 space-y-2">
                <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />

                <Row
                  label={`Discount (${discountPercentage}%)`}
                  value={`- ₹${discount.toFixed(2)}`}
                  color="text-red-500"
                />

                <Row
                  label="Extra Services"
                  value={`+ ₹${extraServiceAmount.toFixed(2)}`}
                  color="text-green-600"
                />
              </div>

              {/* TOTAL */}
              <div className="border p-4 rounded-3xl bg-slate-50">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <button
              onClick={handleGenerateInvoice}
              disabled={loading}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* COMPONENTS */
const TableRow = ({ label, value }) => (
  <tr className="border-t">
    <td className="p-3 font-medium w-1/3">{label}</td>
    <td className="p-3">{value}</td>
  </tr>
);

const Row = ({ label, value, color = "" }) => (
  <div className={`flex justify-between ${color}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default GenerateInvoiceModel;
