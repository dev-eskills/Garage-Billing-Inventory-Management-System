import React from "react";
import { Clock3, Car, User, AlertTriangle, ArrowRight } from "lucide-react";

const pendingJobs = [
  {
    id: "#PND-301",
    customer: "Rahul Sharma",
    vehicle: "Hyundai Creta",
    number: "MP04AB2211",
    issue: "Brake inspection required",
    priority: "High",
    createdAt: "06 May 2026",
  },
  {
    id: "#PND-302",
    customer: "Amit Verma",
    vehicle: "Mahindra Thar",
    number: "MP09XZ9921",
    issue: "Engine oil change pending",
    priority: "Medium",
    createdAt: "05 May 2026",
  },
  {
    id: "#PND-303",
    customer: "Sandeep Yadav",
    vehicle: "Honda City",
    number: "MP13TY7788",
    issue: "AC gas refill required",
    priority: "Low",
    createdAt: "04 May 2026",
  },
];

const priorityColor = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-blue-100 text-blue-600",
};

const PendingJobs = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Clock3 className="text-amber-500" size={32} />
          Pending Jobs
        </h1>
        <p className="text-gray-500 mt-2">
          Jobs waiting for assignment or action
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-5">
        {pendingJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              {/* Left */}
              <div className="flex-1">
                {/* Top badges */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">
                    {job.id}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor[job.priority]}`}
                  >
                    {job.priority} Priority
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {job.vehicle}
                </h2>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Car className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle No</p>
                      <p className="font-medium">{job.number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <User className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{job.customer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <Clock3 className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{job.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Issue */}
                <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-orange-500" size={18} />
                    <p className="text-sm text-gray-500">Issue</p>
                  </div>

                  <p className="text-gray-800">{job.issue}</p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <button className="bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                  Start Job
                  <ArrowRight size={18} />
                </button>

                <button className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                  Assign Mechanic
                </button>

                <button className="bg-amber-100 text-amber-700 px-5 py-3 rounded-xl font-semibold hover:bg-amber-200 transition">
                  Mark In Progress
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingJobs;
