import React, { useMemo, useState } from "react";
import {
  Car,
  Clock3,
  User,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Package,
  Calendar,
  IndianRupee,
  ChevronRight,
  Download,
  FileText,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useJobs } from "../../hooks/useJobs";
import { motion } from "framer-motion";
import {
  fetchInvoiceByJobId,
  generateAndSaveInvoice,
} from "../../supabase/invoices";
import toast from "react-hot-toast";

const AllAssignedJobs = () => {
  const { user } = useAuth();
  const { jobs, isJobsLoading } = useJobs(user?.id);

  // Track which jobs have had invoices generated in this session
  // Maps job.id to the generated invoice URL
  const [generatedInvoices, setGeneratedInvoices] = useState({});
  const [isGenerating, setIsGenerating] = useState({});

  const stats = useMemo(() => {
    if (!jobs) return { pending: 0, inProgress: 0, completed: 0 };
    return {
      pending: jobs.filter((j) => j.job_info?.status === "pending").length,
      inProgress: jobs.filter((j) => j.job_info?.status === "in-progress")
        .length,
      completed: jobs.filter((j) => j.job_info?.status === "completed").length,
    };
  }, [jobs]);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "in-progress":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const handleGenerateInvoice = async (job) => {
    try {
      setIsGenerating((prev) => ({ ...prev, [job.id]: true }));
      const result = await generateAndSaveInvoice(job, user?.id);

      setGeneratedInvoices((prev) => ({
        ...prev,
        [job.id]: result.publicUrl,
      }));
      toast.success("Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, [job.id]: false }));
    }
  };

  const handleDownload = async (jobId) => {
    const data = await fetchInvoiceByJobId(jobId);
    const url = data.public_url;

    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `Invoice_${jobId}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  if (isJobsLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500  text-lg">Loading your assigned jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                <Wrench size={24} />
              </div>
              Services Done
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manage and track all vehicle service orders in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/mechanic/create-job"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/5 active:scale-95"
            >
              + Create New Job
            </Link>
          </div>
        </header>

        {/* Jobs List */}
        <div className="space-y-5">
          {jobs.length === 0 ? (
            <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                <Package size={40} />
              </div>
              <h4 className="text-xl text-slate-700">No Jobs Assigned Yet</h4>
              <p className="text-slate-400 mt-2 max-w-sm">
                When you create or are assigned to a vehicle service, it will
                appear here for management.
              </p>
              <Link
                to="/mechanic/create-job"
                className="mt-6 text-blue-600 hover:underline flex items-center gap-2"
              >
                Start by creating a job <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex-1 space-y-4">
                    {/* ID & Status */}
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">
                        #{job.id.slice(0, 8)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                          job.job_info?.status,
                        )}`}
                      >
                        {job.job_info?.status || "Unknown"}
                      </span>
                    </div>

                    {/* Vehicle/Service */}
                    <h2 className="text-2xl font-bold">
                      {job.job_info?.service_type || "General Service"}
                    </h2>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Car className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Vehicle No</p>
                          <p className="font-medium">
                            {job.customers?.vehicle_details?.vehicle_number ||
                              "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {job.customers?.vehicle_details?.model ||
                              "Unknown Model"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <User className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-medium">
                            {job.customers?.customer_details?.name ||
                              "Walk-in Customer"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {job.customers?.customer_details?.contact || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                          <CalendarDays className="text-yellow-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Service Date</p>
                          <p className="font-medium">
                            {new Date(job.service_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <IndianRupee className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">
                            ₹{" "}
                            {parseFloat(
                              job.total_amount_full_service || 0,
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Issue */}
                    <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-orange-500" size={18} />
                        <p className="text-sm text-gray-500">Issue</p>
                      </div>

                      <p className="text-gray-600">
                        {job.job_info?.repair_issue}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: Actions */}
                  <div className="min-w-45 flex flex-col gap-3">
                    <Link
                      to={`/mechanic/jobs/${job.id}`}
                      className="w-full py-3 bg-slate-900 text-white text-sm rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>

                    {job.job_info?.status === "completed" ? (
                      <button
                        onClick={() => handleDownload(job.id)}
                        className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2"
                      >
                        <Download size={16} /> Download Invoice
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGenerateInvoice(job)}
                        disabled={job.job_info?.status !== "completed"}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating[job.id] ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText size={16} />
                            Generate Invoice
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAssignedJobs;
