import React from "react";
import {
  CheckCircle2,
  Car,
  User,
  CalendarDays,
  Wrench,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

const completedJobs = [
  {
    id: "#CMP-201",
    customer: "Rahul Sharma",
    vehicle: "Hyundai Creta",
    number: "MP04AB2211",
    service: "Brake Pad Replacement",
    completedDate: "06 May 2026",
    amount: "4,500",
    duration: "3 Hours",
  },
  {
    id: "#CMP-202",
    customer: "Amit Verma",
    vehicle: "Mahindra Thar",
    number: "MP09XZ9921",
    service: "Engine Oil Service",
    completedDate: "06 May 2026",
    amount: "2,200",
    duration: "1.5 Hours",
  },
  {
    id: "#CMP-203",
    customer: "Sandeep Yadav",
    vehicle: "Honda City",
    number: "MP13TY7788",
    service: "AC Repair & Gas Filling",
    completedDate: "05 May 2026",
    amount: "6,800",
    duration: "5 Hours",
  },
];

const CompletedJobs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={32} />
            Completed Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            View all completed garage services and repair history.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition">
          Export Reports
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Completed", value: "148" },
          { label: "Earnings This Month", value: "₹ 84,500" },
          { label: "Avg Repair Time", value: "2.8 Hours" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-5">
        {completedJobs.map((job, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              {/* LEFT */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                    {job.id}
                  </span>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-4">{job.vehicle}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <CalendarDays className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed Date</p>
                      <p className="font-medium">{job.completedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Clock3 className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Repair Time</p>
                      <p className="font-medium">{job.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="text-orange-500" size={18} />
                    <p className="text-sm text-gray-500">Service Details</p>
                  </div>

                  <p className="text-gray-800">{job.service}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="min-w-60">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-md">
                  <p className="text-white/80 text-sm">Service Amount</p>

                  <h2 className="text-4xl font-bold mt-3">₹ {job.amount}</h2>

                  <Link
                    to={`/mechanic/invoices/:id`}
                    className="mt-6 w-full bg-white text-green-700 hover:bg-gray-100 transition rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
                  >
                    View Invoice
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default CompletedJobs;
