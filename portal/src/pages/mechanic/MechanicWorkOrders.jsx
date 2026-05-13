import React, { useEffect, useState } from "react";

const sampleWorkOrders = [
  {
    id: 101,
    mechanic: "John Doe",
    vehicle: "Toyota Camry",
    status: "In Progress",
    dueDate: "2026-05-10",
  },
  {
    id: 102,
    mechanic: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Completed",
    dueDate: "2026-05-08",
  },
  {
    id: 103,
    mechanic: "Alex Lee",
    vehicle: "Ford F-150",
    status: "Awaiting Parts",
    dueDate: "2026-05-12",
  },
  {
    id: 104,
    mechanic: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Completed",
    dueDate: "2026-05-08",
  },
  {
    id: 105,
    mechanic: "Alex Lee",
    vehicle: "Ford F-150",
    status: "Awaiting Parts",
    dueDate: "2026-05-12",
  },
  {
    id: 106,
    mechanic: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Completed",
    dueDate: "2026-05-08",
  },
  {
    id: 107,
    mechanic: "Alex Lee",
    vehicle: "Ford F-150",
    status: "Awaiting Parts",
    dueDate: "2026-05-12",
  },
  {
    id: 108,
    mechanic: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Completed",
    dueDate: "2026-05-08",
  },
  {
    id: 109,
    mechanic: "Alex Lee",
    vehicle: "Ford F-150",
    status: "Awaiting Parts",
    dueDate: "2026-05-12",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Awaiting Parts":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MechanicWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    setWorkOrders(sampleWorkOrders);
  }, []);

  return (
    <div className="min-h-auto max-h-[80vh] bg-gray-50 p-6 rounded-2xl shadow-sm mt-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Mechanic Work Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track all assigned jobs and their status
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <span>ID</span>
          <span>Mechanic</span>
          <span>Vehicle</span>
          <span>Status</span>
          <span>Due Date</span>
        </div>

        {/* Rows */}
        {workOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No mechanic work orders available.
          </div>
        ) : (
          <div className="max-h-[40vh] overflow-y-auto">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-5 items-center px-6 py-5 border-t border-gray-100 hover:bg-gray-50 transition"
              >
                {/* ID */}
                <div className="font-medium text-gray-900">#{order.id}</div>

                {/* Mechanic */}
                <div className="text-gray-700">{order.mechanic}</div>

                {/* Vehicle */}
                <div className="text-gray-700">{order.vehicle}</div>

                {/* Status */}
                <div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Due Date */}
                <div className="text-gray-500 text-sm">{order.dueDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicWorkOrders;
