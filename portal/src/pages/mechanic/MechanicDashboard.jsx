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
import { useAuth } from "../../hooks/useAuth";
import { useJobs } from "../../hooks/useJobs";
import { useDashboard } from "../../hooks/useDashboard";
import { useInvoices } from "../../hooks/useInvoices";
import QuickActions from "../../Components/Mechanic/QuickActions";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationList from "../../Components/admin/NotificationList";
import CreateReminderModal from "../../Components/Mechanic/CreateReminderModal";
import { Bell, Clock } from "lucide-react";

import RecentActivities from "../../Components/Mechanic/RecentActivities";
import { useMechanicInventory } from "../../hooks/useMechanicInventory";

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
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const { mechanicNotifications, markAsRead } = useNotifications(user?.id);

  const unreadCount = mechanicNotifications?.filter(n => n.status === 'unread').length || 0;
  const {
    stats,
    statsLoading,
    globalStats,
    userStats,
    globalStatsLoading,
    userStatsLoading,
  } = useDashboard();

  console.log("user Dashboard", userStats);

  const dashboardStats = [
    {
      title: "Total Jobs",
      value: userStats?.totalJobs || 0,
      subtitle: "Assigned / completed jobs",
      change: `${userStats?.completedJobs || 0} completed • ${userStats?.pendingJobs || 0} pending`,
      color: "bg-indigo-100 text-indigo-700",
    },

    {
      title: "Parts Inventory",
      value: userStats?.parts || 0,
      subtitle: "Available spare parts",
      change: `₹${Math.abs(userStats?.totalInventoryValue || 0).toLocaleString("en-IN")}`,
      color:
        (userStats?.totalInventoryValue || 0) >= 0
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700",
    },

    {
      title: "Invoices",
      value: userStats?.invoices || 0,
      subtitle: "Total invoices created",
      change: `${userStats?.customers || 0} customers`,
      color: "bg-emerald-100 text-emerald-700",
    },

    {
      title: "Customers",
      value: userStats?.customers || 0,
      subtitle: "Registered customers",
      change: "Active base",
      color: "bg-sky-100 text-sky-700",
    },

    {
      title: "Inventory Value",
      value: `₹${Math.abs(userStats?.totalInventoryValue || 0).toLocaleString("en-IN")}`,
      subtitle: "Total stock value",
      change:
        (userStats?.totalInventoryValue || 0) >= 0
          ? "Stock healthy"
          : "Stock deficit detected",
      color:
        (userStats?.totalInventoryValue || 0) >= 0
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700",
    },

    {
      title: "System Status",
      value: `${userStats?.completedJobs || 0}/${userStats?.totalJobs || 0}`,
      subtitle: "Completed vs total jobs",
      change: "Live tracking enabled",
      color: "bg-violet-100 text-violet-700",
    },
  ];

  const { MechanicPartsUsage } = useMechanicInventory(user?.id);
  const inventoryItems = MechanicPartsUsage || [];

  console.log(MechanicPartsUsage);
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
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-100 hover:border-indigo-300 flex items-center gap-2 cursor-pointer"
              >
                <Clock size={18} />
                Set Reminder
              </button>
              {/* <MechanicProfileButton /> */}
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
            </Link>{" "}
            <Link
              to="/mechanic/parts"
              className="rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-5 py-3 text-sm font-semibold flex items-center gap-2"
            >
              <Package size={18} className="text-indigo-500" />
              My Inventory
            </Link>
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="rounded-3xl min-h-[50vh] bg-white p-6 shadow-sm ring-1 ring-slate-200">
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
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${job.job_info?.status === "completed"
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
            {/* <MechanicInvoices /> */}
          </div>

          <div className="space-y-6">
            {/* <RecentActivities /> */}

            {/* <QuickActions /> */}

          </div>
          {/* </div> */}
        </section>

        {/* Notifications & Reminders Section */}
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Bell size={22} />
              </div>

              {/* Header Text */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">Notifications & Reminders</h2>
                <p className="text-sm text-slate-500 font-medium">Updates from admin and your personal reminders.</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Notifications List */}
            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
              <NotificationList
                notifications={mechanicNotifications || []}
                onMarkAsRead={markAsRead}
              />
            </div>

            {/* Right Side: Reminder Action */}
            <div className="flex flex-col items-center justify-center text-center p-8 bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-100">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-500 mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Need to remember something?</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-2 mb-6">
                Set a personal reminder for inventory checks, customer calls, or vehicle follow-ups.
              </p>
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                Create Reminder
              </button>
            </div>
          </div>
        </section>
      </div>

      {isReminderModalOpen && (
        <CreateReminderModal
          onClose={() => setIsReminderModalOpen(false)}
          mechanicId={user?.id}
        />
      )}
    </div>

  );
};

export default MechanicDashboard;