import React from "react";
import { FileText, Download, Eye, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const invoices = [
  {
    id: "INV-1001",
    customer: "Rahul Sharma",
    date: "07 May 2026",
    amount: 6800,
    status: "Paid",
  },
  {
    id: "INV-1002",
    customer: "Amit Verma",
    date: "05 May 2026",
    amount: 4200,
    status: "Pending",
  },
  {
    id: "INV-1003",
    customer: "Neha Singh",
    date: "02 May 2026",
    amount: 9100,
    status: "Paid",
  },
];

const MechanicInvoices = () => {
  return (
    <div className="min-h-[80vh] rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage all job invoices and payments
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <span>Invoice</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        {invoices.map((inv, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center px-6 py-5 border-t border-gray-100 hover:bg-gray-50 transition"
          >
            {/* Invoice ID */}
            <div className="flex items-center gap-2 font-medium text-gray-900">
              <FileText size={16} className="text-blue-600" />
              {inv.id}
            </div>

            {/* Customer */}
            <div className="text-gray-700">{inv.customer}</div>

            {/* Date */}
            <div className="text-gray-500 text-sm">{inv.date}</div>

            {/* Status + Actions */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                  inv.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {inv.status === "Paid" ? (
                  <CheckCircle size={14} />
                ) : (
                  <Clock size={14} />
                )}
                {inv.status}
              </span>

              <div className="flex items-center gap-3 text-gray-500">
                <Link
                  to={"/mechanic/invoices/:id"}
                  className="hover:text-blue-600"
                >
                  <Eye size={18} />
                </Link>

                <button className="hover:text-green-600">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicInvoices;
