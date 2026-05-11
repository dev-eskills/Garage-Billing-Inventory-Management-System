import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Package,
  Inbox,
  History,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  ChevronDown,
  UserRound,
} from "lucide-react";
import MechanicProfileButton from "../../Components/MechanicProfileButton";
import MechanicInvoices from "./MechanicInvoices";
import { useAuth } from "../../hooks/useAuth";
import { useJobs } from "../../hooks/useJobs";
import { useDashboard } from "../../hooks/useDashboard";
import { useInvoices } from "../../hooks/useInvoices";

// const dashboardStats = [
//   {
//     title: "Active jobs",
//     value: "18",
//     subtitle: "In progress this week",
//     change: "+12%",
//     color: "bg-indigo-100 text-indigo-700",
//   },
//   {
//     title: "Parts low stock",
//     value: "6",
//     subtitle: "Needs reorder",
//     change: "-8%",
//     color: "bg-amber-100 text-amber-700",
//   },
//   {
//     title: "Open invoices",
//     value: "11",
//     subtitle: "Awaiting payment",
//     change: "+22%",
//     color: "bg-emerald-100 text-emerald-700",
//   },
//   {
//     title: "Customers today",
//     value: "14",
//     subtitle: "New check-ins",
//     change: "+5%",
//     color: "bg-sky-100 text-sky-700",
//   },
// ];

// const assignedJobs = [
//   {
//     id: "WO-1024",
//     vehicle: "Toyota Camry",
//     service: "Brake repair",
//     due: "Today",
//     status: "In progress",
//   },
//   {
//     id: "WO-1027",
//     vehicle: "Ford F-150",
//     service: "Oil change",
//     due: "Tomorrow",
//     status: "Pending",
//   },
//   {
//     id: "WO-1031",
//     vehicle: "Honda Civic",
//     service: "Transmission check",
//     due: "Apr 15",
//     status: "Review",
//   },
// ];

const inventoryItems = [
  { name: "Brake pads", usage: "52%", available: "14 left" },
  { name: "Engine oil", usage: "36%", available: "26 left" },
  { name: "Air filters", usage: "71%", available: "9 left" },
];

const recentActivity = [
  { time: "08:20 AM", text: "Assigned brake repair to Sam.", type: "task" },
  { time: "09:10 AM", text: "Updated invoice for WO-1024.", type: "invoice" },
  {
    time: "10:05 AM",
    text: "Created parts request for air filters.",
    type: "parts",
  },
];

const statusClasses = {
  "In progress": "bg-slate-100 text-slate-800",
  Pending: "bg-amber-100 text-amber-800",
  Review: "bg-sky-100 text-sky-800",
};

const MechanicDashboard = () => {
  const { user } = useAuth();
  const { jobs, isJobsLoading } = useJobs(user?.id);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { stats, statsLoading } = useDashboard();
  const { allInvoices } = useInvoices();
  console.log(allInvoices);
  const dashboardStats = [
    {
      title: "Active Jobs",
      value: stats?.activeJobs || 0,
      subtitle: "Currently pending jobs",
      change: `${stats?.completedJobs || 0} completed`,
      color: "bg-indigo-100 text-indigo-700",
    },

    {
      title: "Parts Inventory",
      value: stats?.parts || 0,
      subtitle: "Available spare parts",
      change: `${stats?.purchases || 0} purchases`,
      color: "bg-amber-100 text-amber-700",
    },

    {
      title: "Open Invoices",
      value: stats?.invoices || 0,
      subtitle: "Awaiting payments",
      change: `₹${stats?.revenue?.toLocaleString("en-IN") || 0}`,
      color: "bg-emerald-100 text-emerald-700",
    },

    {
      title: "Customers",
      value: stats?.customers || 0,
      subtitle: "Registered customers",
      change: `${stats?.mechanics || 0} mechanics`,
      color: "bg-sky-100 text-sky-700",
    },

    {
      title: "Revenue",
      value: `₹${stats?.revenue?.toLocaleString("en-IN") || 0}`,
      subtitle: "Total earnings",
      change: `₹${stats?.profitability?.toLocaleString("en-IN") || 0} profit`,
      color: "bg-green-100 text-green-700",
    },

    {
      title: "Expenses",
      value: `₹${stats?.expenses?.toLocaleString("en-IN") || 0}`,
      subtitle: "Business expenses",
      change: `₹${stats?.losses?.toLocaleString("en-IN") || 0} losses`,
      color: "bg-red-100 text-red-700",
    },

    {
      title: "Purchases",
      value: stats?.purchases || 0,
      subtitle: "Total purchase orders",
      change: `₹${stats?.totalPurchasesAmount?.toLocaleString("en-IN") || 0}`,
      color: "bg-violet-100 text-violet-700",
    },

    {
      title: "Profitability",
      value: `₹${stats?.profitability?.toLocaleString("en-IN") || 0}`,
      subtitle: "Net business profit",
      change: stats?.profitability > 0 ? "Profitable" : "Loss Running",
      color:
        stats?.profitability > 0
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Mechanic dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back, {user?.user_metadata?.full_name || "Mechanic"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review your current workload, parts alerts, and open jobs at a
                glance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/mechanic/create-customer"
                className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-5 py-3 text-sm font-semibold transition hover:bg-purple-100 hover:border-purple-300 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add New Customer
              </Link>
              {/* Create Job (Action) */}
              <Link
                to="/mechanic/create-job"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create New Job
              </Link>
              <MechanicProfileButton />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5 items-center">
            {/* Jobs Buttons */}
            <Link
              to="/mechanic/all-jobs"
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-full bg-slate-900 hover:bg-slate-800 "
            >
              <Briefcase size={16} />
              Jobs
            </Link>
            {/* <Link
              to="/mechanic/completed-jobs"
              className=" flex gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 text-sm font-semibold hover:bg-emerald-100"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              Completed Jobs
            </Link> */}
            {/* <Link
              to="/mechanic/pending-jobs"
              className="flex gap-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-5 py-3 text-sm font-semibold hover:bg-amber-100"
            >
              <AlertCircle size={18} className="text-amber-500" />
              Pending Jobs
            </Link> */}
            <Link
              to="/mechanic/invoices"
              className=" flex gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 text-sm font-semibold hover:bg-emerald-100"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              Invoice
            </Link>
            <Link
              to="/mechanic/customers"
              className="flex gap-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-5 py-3 text-sm font-semibold hover:bg-amber-100"
            >
              <UserRound size={18} className="text-amber-500" />
              Customers
            </Link>

            {/* Inventory Dropdown */}
            <div className="relative group">
              <button className="rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-5 py-3 text-sm font-semibold flex items-center gap-2">
                <Package size={16} />
                Inventory
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>

              <div className="absolute mt-0.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                {" "}
                <Link
                  to="/mechanic/parts"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-indigo-700 hover:bg-indigo-50 transition duration-150 ease-in-out"
                >
                  <Package size={18} className="text-indigo-500" />
                  My Inventory
                </Link>
                <div className="border-t border-slate-200"></div>
                <Link
                  to="/mechanic/parts-requests"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-indigo-700 hover:bg-indigo-50 transition duration-150 ease-in-out"
                >
                  <Inbox size={18} className="text-indigo-500" />
                  Request Parts
                </Link>
              </div>
            </div>

            {/* Purchases Dropdown */}
            <div className="relative group inline-block">
              <button className="rounded-full bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200 px-5 py-3 text-sm font-semibold flex items-center gap-2">
                <ShoppingCart size={16} />
                Purchases
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>

              <div className="absolute top-full left-0 mt-0.5 w-46 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <Link
                  to="/mechanic/purchase"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-200 transition duration-150 ease-in-out"
                >
                  <Package size={18} className="text-slate-500" />
                  Purchase Parts
                </Link>
                <div className="border-t border-slate-200"></div>
                <Link
                  to="/mechanic/purchase-history"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-200 transition duration-150 ease-in-out"
                >
                  <History size={18} className="text-slate-500" />
                  Purchase History
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stat.color}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500">{stat.subtitle}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Current Jobs
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Your current work orders and upcoming due dates.
                  </p>
                </div>
                <Link
                  to={"/mechanic/all-jobs"}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 hover:shadow-md transition"
                  >
                    <Link to={`/mechanic/jobs/${job.id}`} className="block">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            #{job.id.slice(0, 8)}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-slate-900">
                            {job.customers?.vehicle_details?.model ||
                              "Unknown Vehicle"}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            job.job_info?.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : statusClasses[job.job_info?.status] ||
                                "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {job.job_info?.status || "Pending"}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <p className="text-sm text-slate-600">
                          Customer:{" "}
                          {job.customers?.customer_details?.name ||
                            "Walk-in Customer"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Vehicle No:{" "}
                          {job.customers?.vehicle_details?.vehicle_number ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <p className="text-sm text-slate-600">
                          Service:{" "}
                          {job.job_info?.service_type || "General Service"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Due:{" "}
                          {new Date(job.service_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <p className="text-center text-sm text-slate-400 mt-4">
                    No current jobs assigned.
                  </p>
                )}
              </div>
            </div>
            <MechanicInvoices />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent activity
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Latest updates from your team and tasks.
              </p>

              <div className="mt-6 space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={`${item.time}-${item.type}`}
                    className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-sm font-semibold text-slate-700">
                      {item.time.split(":")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.text}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h2>
              <div className="mt-5 grid gap-3">
                <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Create new parts request
                </button>
                <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Mark today's work orders complete
                </button>
                <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Review customer feedback
                </button>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Inventory usage
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Parts being consumed fastest this week.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {inventoryItems.map((item) => (
                  <div
                    key={item.name}
                    className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.available}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        {item.usage}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: item.usage }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MechanicDashboard;
