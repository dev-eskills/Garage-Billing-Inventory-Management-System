import React from "react";
import { Package, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";

const partsRequests = [
  {
    id: "PR-1001",
    part: "Brake Pads",
    quantity: 2,
    requestedBy: "John Doe",
    priority: "High",
    status: "Pending",
    date: "07 May 2026",
  },
  {
    id: "PR-1002",
    part: "Engine Oil",
    quantity: 1,
    requestedBy: "Jane Smith",
    priority: "Medium",
    status: "Approved",
    date: "06 May 2026",
  },
  {
    id: "PR-1003",
    part: "Air Filter",
    quantity: 3,
    requestedBy: "Alex Lee",
    priority: "Low",
    status: "Rejected",
    date: "05 May 2026",
  },
];

const statusStyle = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const priorityStyle = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-blue-100 text-blue-600",
};

const PartsRequest = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Package className="text-indigo-600" size={32} />
          Parts Requests
        </h1>
        <p className="text-gray-500 mt-2">
          Manage all spare parts requests from mechanics
        </p>
      </div>

      {/* List */}
      <div className="space-y-5">
        {partsRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              {/* LEFT */}
              <div className="flex-1">
                {/* Top row */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">
                    {req.id}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${priorityStyle[req.priority]}`}
                  >
                    {req.priority} Priority
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle[req.status]}`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Content */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {req.part}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Requested By</p>
                    <p className="font-medium text-gray-800">
                      {req.requestedBy}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-800">{req.quantity}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{req.date}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <button className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                  Approve
                </button>

                <button className="bg-red-100 text-red-700 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition">
                  Reject
                </button>

                <button className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsRequest;
