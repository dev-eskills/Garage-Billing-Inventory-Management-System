// import React from "react";
// import {
//   FileText,
//   User,
//   Car,
//   Phone,
//   CalendarDays,
//   Wrench,
//   Printer,
//   Download,
// } from "lucide-react";
// import { useParams } from "react-router-dom";

// const MechanicInvoiceDetail = () => {
//   const { id } = useParams();
//   console.log(id);
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Invoice Detail</h1>
//           <p className="text-sm text-gray-500 mt-1">Invoice ID: INV-1001</p>
//         </div>

//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
//             <Printer size={16} />
//             Print
//           </button>

//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
//             <Download size={16} />
//             Download
//           </button>
//         </div>
//       </div>

//       {/* Main Card */}
//       <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
//           {/* Customer Info */}
//           <div>
//             <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
//               <User size={18} /> Customer Details
//             </h2>

//             <div className="space-y-2 text-gray-700">
//               <p>Rahul Sharma</p>
//               <p className="flex items-center gap-2 text-sm text-gray-500">
//                 <Phone size={14} /> +91 9876543210
//               </p>
//             </div>
//           </div>

//           {/* Vehicle Info */}
//           <div>
//             <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
//               <Car size={18} /> Vehicle Details
//             </h2>

//             <div className="space-y-2 text-gray-700">
//               <p>Hyundai Creta</p>
//               <p className="text-sm text-gray-500">MP04AB2211</p>
//             </div>
//           </div>
//         </div>

//         {/* Service Info */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//           <div>
//             <p className="text-sm text-gray-500 flex items-center gap-2">
//               <CalendarDays size={14} /> Date
//             </p>
//             <p className="font-semibold">07 May 2026</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Service Type</p>
//             <p className="font-semibold">Brake Repair</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Status</p>
//             <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//               Paid
//             </span>
//           </div>
//         </div>

//         {/* Parts Table */}
//         <div className="mt-8">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Wrench size={18} /> Parts Used
//           </h2>

//           <div className="overflow-hidden border border-gray-200 rounded-2xl">
//             <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
//               <span>Part</span>
//               <span>Qty</span>
//               <span>Price</span>
//               <span>Total</span>
//             </div>

//             {[
//               {
//                 name: "Brake Pads",
//                 qty: 2,
//                 price: 2400,
//               },
//               {
//                 name: "Brake Oil",
//                 qty: 1,
//                 price: 600,
//               },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="grid grid-cols-4 px-4 py-4 border-t border-gray-100 text-sm"
//               >
//                 <span>{item.name}</span>
//                 <span>{item.qty}</span>
//                 <span>₹ {item.price}</span>
//                 <span className="font-semibold">₹ {item.qty * item.price}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Total */}
//         <div className="mt-6 flex justify-end">
//           <div className="w-full md:w-1/3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Subtotal</span>
//               <span>₹ 5,400</span>
//             </div>

//             <div className="flex justify-between text-sm text-gray-600 mt-2">
//               <span>Tax</span>
//               <span>₹ 600</span>
//             </div>

//             <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
//               <span>Total</span>
//               <span>₹ 6,000</span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 text-sm text-gray-500">
//           Generated by Garage Management System
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MechanicInvoiceDetail;

import React from "react";
import {
  FileText,
  User,
  Car,
  Phone,
  CalendarDays,
  Wrench,
  Printer,
  Download,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useInvoices } from "../../hooks/useInvoices"; // your hook

const MechanicInvoiceDetail = () => {
  const { id } = useParams();
  const { invoice, invoiceLoading } = useInvoices({ invoiceId: id });
  if (invoiceLoading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  const customer = invoice.jobs.customers.customer_details || {};
  const vehicle = invoice.jobs.customers.vehicle_details || {};
  const parts = invoice.jobs.parts_items || [];
  const serviceInfo = invoice.jobs.job_info || {};
  const discount = invoice.jobs.discount_percentage;

  // Calculate subtotal
  const subtotal =
    invoice.jobs.total_amount_full_service - invoice.jobs.extra_service.amount;
  const tax = invoice.jobs.tax || 0; // add tax field if exists
  const total = invoice.jobs.total_amount_full_service;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Detail</h1>
          <p className="text-sm text-gray-500 mt-1">Invoice ID: {invoice.id}</p>
        </div>

        <div className="flex gap-3">
          <a
            href={invoice.public_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <Printer size={16} />
            Print
          </a>

          <a
            href={invoice.public_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
          {/* Customer Info */}
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User size={18} /> Customer Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>{customer.name}</p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={14} /> {customer.contact}
              </p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Car size={18} /> Vehicle Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>{vehicle.model}</p>
              <p className="text-sm text-gray-500">{vehicle.vehicle_number}</p>
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <CalendarDays size={14} /> Date
            </p>
            <p className="font-semibold">
              {new Date(invoice.jobs.service_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Service Type</p>
            <p className="font-semibold">{serviceInfo.service_type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
                serviceInfo.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {serviceInfo.status === "completed" ? "Paid" : "Pending"}
            </span>
          </div>
        </div>

        {/* Parts Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wrench size={18} /> Parts Used
          </h2>

          <div className="overflow-hidden border border-gray-200 rounded-2xl">
            <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Part</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
            </div>

            {parts.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-4 px-4 py-4 border-t border-gray-100 text-sm"
              >
                <span>{item.part_name}</span>
                <span>{item.quantity}</span>
                <span>₹ {item.unit_price}</span>
                <span className="font-semibold">₹ {item.total_price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end">
          <div className="w-full md:w-1/3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            {invoice.jobs.extra_service && (
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Extra Service</span>
                <span>₹ {invoice.jobs.extra_service.amount}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Discount</span>
              <span> {discount} %</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Tax</span>
              <span>₹ {tax}</span>
            </div>

            <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500">
          Generated by Garage Management System
        </div>
      </div>
    </div>
  );
};

export default MechanicInvoiceDetail;
