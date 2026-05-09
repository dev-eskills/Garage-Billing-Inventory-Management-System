import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";
import MechanicProfileButton from "../../Components/MechanicProfileButton";
import MechanicInvoices from "./MechanicInvoices";
import { useAuth } from "../../hooks/useAuth";

const dashboardStats = [
  {
    title: "Active jobs",
    value: "18",
    subtitle: "In progress this week",
    change: "+12%",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Parts low stock",
    value: "6",
    subtitle: "Needs reorder",
    change: "-8%",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Open invoices",
    value: "11",
    subtitle: "Awaiting payment",
    change: "+22%",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Customers today",
    value: "14",
    subtitle: "New check-ins",
    change: "+5%",
    color: "bg-sky-100 text-sky-700",
  },
];

const assignedJobs = [
  {
    id: "WO-1024",
    vehicle: "Toyota Camry",
    service: "Brake repair",
    due: "Today",
    status: "In progress",
  },
  {
    id: "WO-1027",
    vehicle: "Ford F-150",
    service: "Oil change",
    due: "Tomorrow",
    status: "Pending",
  },
  {
    id: "WO-1031",
    vehicle: "Honda Civic",
    service: "Transmission check",
    due: "Apr 15",
    status: "Review",
  },
];

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
                Welcome back, {user?.user_metadata?.full_name || 'Mechanic'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review your current workload, parts alerts, and open jobs at a
                glance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/mechanic/create-customer"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add New Customer
              </Link>
              <Link 
                to="/mechanic/purchase"
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 flex items-center gap-2"
              >
                <Package size={18} />
                Purchase Parts
              </Link>
              <Link 
                to="/mechanic/parts"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center gap-2 shadow-sm"
              >
                <Package size={18} />
                My Inventory
              </Link>

              <MechanicProfileButton />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5 items-center">
            {/* All Jobs (Primary neutral) */}
            <Link
              to="/mechanic/all-jobs"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
            >
              All Jobs
            </Link>

            {/* Purchase Parts (Highlight) */}
            <Link
              to="/mechanic/purchase"
              className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-5 py-3 text-sm font-semibold transition hover:bg-blue-100 hover:border-blue-300"
            >
              Purchase Parts
            </Link>

            {/* Completed (calm success green) */}
            <Link
              to="/mechanic/completed-jobs"
              className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 text-sm font-semibold transition hover:bg-emerald-100 hover:border-emerald-300"
            >
              Completed Jobs
            </Link>

            {/* Pending (warm warning amber) */}
            <Link
              to="/mechanic/pending-jobs"
              className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-5 py-3 text-sm font-semibold transition hover:bg-amber-100 hover:border-amber-300"
            >
              Pending Jobs
            </Link>

            {/* Create Job (Action) */}
            <Link
              to="/mechanic/create-job"
              className="rounded-full bg-blue-600 text-white px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 shadow-md flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Create New Job
            </Link>

            {/* My Inventory (Personal stock) */}
            <Link
              to="/mechanic/parts"
              className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-100 hover:border-indigo-300 flex items-center gap-2"
            >
              <Package size={16} />
              My Inventory
            </Link>

            {/* Purchase History (Audit trail) */}
            <Link
              to="/mechanic/purchase-history"
              className="rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-100 hover:border-slate-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              Purchase History
            </Link>

            {/* Parts Requests (cool info blue) */}
            <Link
              to="/mechanic/parts-requests"
              className="rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-5 py-3 text-sm font-semibold transition hover:bg-sky-100 hover:border-sky-300"
            >
              Request Parts
            </Link>
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
                    All Current jobs
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
                {assignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    {/* <Link to={`/mechanic/jobs/${job.id}`} className="block"> */}
                    <Link to={`/mechanic/jobs/${job.id}`} className="block">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            {job.id}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-slate-900">
                            {job.vehicle}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[job.status]}`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <p className="text-sm text-slate-600">
                          Service: {job.service}
                        </p>
                        <p className="text-sm text-slate-600">Due: {job.due}</p>
                      </div>
                    </Link>
                  </div>
                ))}
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
