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
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useJobs } from "../../hooks/useJobs";
import { motion } from "framer-motion";
import { generateAndSaveInvoice } from "../../supabase/invoices";
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
      pending: jobs.filter(j => j.job_info?.status === 'pending').length,
      inProgress: jobs.filter(j => j.job_info?.status === 'in-progress').length,
      completed: jobs.filter(j => j.job_info?.status === 'completed').length,
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
      setIsGenerating(prev => ({ ...prev, [job.id]: true }));
      const result = await generateAndSaveInvoice(job, user?.id);
      
      setGeneratedInvoices(prev => ({ 
        ...prev, 
        [job.id]: result.publicUrl 
      }));
      toast.success("Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice.");
    } finally {
      setIsGenerating(prev => ({ ...prev, [job.id]: false }));
    }
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
            <p className="text-slate-500 mt-2 font-medium">Manage and track all vehicle service orders in real-time.</p>
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
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="py-20 bg-white rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                <Package size={40} />
              </div>
              <h4 className="text-xl text-slate-700">No Jobs Assigned Yet</h4>
              <p className="text-slate-400 mt-2 max-w-sm">When you create or are assigned to a vehicle service, it will appear here for management.</p>
              <Link to="/mechanic/create-job" className="mt-6 text-blue-600 hover:underline flex items-center gap-2">
                Start by creating a job <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            jobs.map((job, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={job.id}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Status & Main Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-lg border border-slate-200 uppercase tracking-wider">
                        #{job.id.slice(0, 8)}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] rounded-lg border uppercase tracking-wider ${getStatusStyles(job.job_info?.status)}`}>
                        {job.job_info?.status || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs ml-auto">
                        <Calendar size={14} />
                        {new Date(job.service_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                          {job.job_info?.service_type || 'General Service'}
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          {job.job_info?.repair_issue}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Total Amount</p>
                        <p className="text-xl text-slate-900 flex items-center justify-end gap-1">
                          <IndianRupee size={16} />
                          {parseFloat(job.total_amount_full_service || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <User size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Customer</p>
                          <p className="text-slate-800 truncate">{job.customers?.customer_details?.name || 'Walk-in Customer'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Car size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Contact</p>
                          <p className="text-slate-800 truncate">{job.customers?.customer_details?.contact || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <Package size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Parts Used</p>
                          <p className="text-slate-800 truncate">
                            {job.parts_items?.length || 0} items
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col items-center justify-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6 min-w-[160px]">
                    <Link
                      to={`/mechanic/jobs/${job.id}`}
                      className="w-full py-3 bg-slate-900 text-white text-sm rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Link>
                    
                    {generatedInvoices[job.id] ? (
                      <a 
                        href={generatedInvoices[job.id]} 
                        download={`Invoice_${job.id}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm rounded-lg hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Download size={16} />
                        Download Invoice
                      </a>
                    ) : (
                      <button 
                        onClick={() => handleGenerateInvoice(job)}
                        disabled={isGenerating[job.id]}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
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
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAssignedJobs;
