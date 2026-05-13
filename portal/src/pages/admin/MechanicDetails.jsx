import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  User,
  Car,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminMechanic } from '../../hooks/useAdminMechanic';
import { useInvoices } from '../../hooks/useInvoices';

const MechanicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mechanics, mechanicsPending, mechanicsJobs, mechanicsJobsPending } = useAdminMechanic(id);
  const { downloadInvoice } = useInvoices();
  // Find the current mechanic from the mechanics list
  const mechanic = mechanics?.find(m => m.id === id);

  if (mechanicsPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="bg-white p-8 rounded-md border border-gray-100 text-center">
        <h4 className="text-xl font-bold text-gray-900 mb-2">Mechanic Not Found</h4>
        <p className="text-gray-500 mb-6">The mechanic you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/admin/mechanics')}
          className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
        >
          <ArrowLeft size={16} /> Back to Mechanics
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/mechanics')}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Mechanic Profile</h3>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Details & Job History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Mechanic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-6 pb-6 text-center -mt-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md text-[#2b5ae3] font-bold text-3xl uppercase mb-4">
                {mechanic.full_name?.charAt(0) || 'M'}
              </div>
              <h4 className="text-xl font-bold text-gray-900">{mechanic.full_name}</h4>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2b5ae3] rounded-full text-xs font-bold uppercase tracking-tight border border-blue-100 mt-2">
                <Wrench size={12} />
                {mechanic.role}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-gray-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-gray-700">{mechanic.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-gray-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                  <p className="text-sm font-medium text-gray-700">{mechanic.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-gray-400">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-medium text-gray-700">{mechanic.address || 'No address provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
            <h5 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Quick Stats</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-2xl font-bold text-blue-600">{mechanicsJobs?.length || 0}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Jobs</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-2xl font-bold text-green-600">
                  ₹{(mechanicsJobs?.reduce((sum, job) => sum + (job.total_amount_full_service || 0), 0) || 0).toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Job History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 tracking-tight">Assigned Job History</h4>
              <div className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full uppercase tracking-tight">
                {mechanicsJobs?.length || 0} Entries
              </div>
            </div>

            <div className="flex-1 p-6">
              {mechanicsJobsPending ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : mechanicsJobs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                  <Clock size={40} className="mb-4 opacity-20" />
                  <p className="font-medium">No job history found for this mechanic.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mechanicsJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-md border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all group relative"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px]  text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase tracking-tighter group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.service_type}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <User size={14} className="text-gray-300" />
                              {job.customer_details?.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Car size={14} className="text-gray-300" />
                              {job.vehicle_details?.name} ({job.vehicle_details?.number})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Job Value</p>
                            <p className="text-sm font-bold text-gray-900 flex items-center justify-end">
                              <IndianRupee size={12} className="mr-0.5 text-gray-400" />
                              {job.total_amount_full_service?.toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={18} />
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const inv = Array.isArray(job.invoices) ? job.invoices[0] : job.invoices;
                                if (inv) {
                                  downloadInvoice(inv.storage_path, inv.file_name);
                                } else {
                                  alert("No invoice generated for this job yet.");
                                }
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
                              title="Download Invoice"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicDetails;
