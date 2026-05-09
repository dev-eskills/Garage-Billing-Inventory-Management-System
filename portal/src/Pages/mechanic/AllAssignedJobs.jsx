// // import React from "react";
// // import {
// //   Car,
// //   Clock3,
// //   User,
// //   Wrench,
// //   ArrowRight,
// //   CheckCircle2,
// //   AlertTriangle,
// // } from "lucide-react";
// // import CompletedJobs from "../../components/Mechanic/CompletedJobs";
// // import { Link } from "react-router-dom";
// // import AssignPartsModal from "../../Components/AssignPartsModal";

// // const jobs = [
// //   {
// //     id: "#JOB-1021",
// //     customer: "Rahul Sharma",
// //     vehicle: "Hyundai Creta",
// //     number: "MP04AB2211",
// //     issue: "Brake Pad Replacement",
// //     status: "In Progress",
// //     priority: "High",
// //     assignedTime: "10:30 AM",
// //   },
// //   {
// //     id: "#JOB-1022",
// //     customer: "Amit Verma",
// //     vehicle: "Mahindra Thar",
// //     number: "MP09XZ9921",
// //     issue: "Engine Oil Service",
// //     status: "Pending",
// //     priority: "Medium",
// //     assignedTime: "11:45 AM",
// //   },
// //   {
// //     id: "#JOB-1023",
// //     customer: "Sandeep Yadav",
// //     vehicle: "Honda City",
// //     number: "MP13TY7788",
// //     issue: "AC Repair",
// //     status: "Completed",
// //     priority: "Low",
// //     assignedTime: "01:15 PM",
// //   },
// // ];

// // const AllAssignedJobs = () => {
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
// //       {/* Header */}
// //       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
// //         <div>
// //           <h1 className="text-3xl font-bold flex items-center gap-3">
// //             <Wrench className="text-blue-600" size={32} />
// //             Assigned Jobs
// //           </h1>

// //           <p className="text-gray-500 mt-2">
// //             Track all mechanic repair tasks and assigned vehicles.
// //           </p>
// //         </div>

// //         <div className="flex gap-3">
// //           <button className="bg-white border border-gray-200 hover:bg-gray-100 px-5 py-3 rounded-xl shadow-sm">
// //             Filter Jobs
// //           </button>

// //           <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow">
// //             + Add New Job
// //           </button>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
// //         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-500 text-sm">Pending Jobs</p>
// //               <h2 className="text-3xl font-bold mt-2">07</h2>
// //             </div>
// //             <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
// //               <AlertTriangle className="text-red-500" size={24} />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-500 text-sm">In Progress</p>
// //               <h2 className="text-3xl font-bold mt-2">12</h2>
// //             </div>
// //             <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
// //               <Clock3 className="text-yellow-600" size={24} />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-gray-500 text-sm">Completed Today</p>
// //               <h2 className="text-3xl font-bold mt-2">18</h2>
// //             </div>
// //             <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
// //               <CheckCircle2 className="text-green-600" size={24} />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Jobs List */}
// //       <div className="space-y-5">
// //         {jobs.map((job, index) => (
// //           <div
// //             key={index}
// //             className="bg-white border border-gray-200 hover:shadow-md transition rounded-2xl p-6"
// //           >
// //             <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
// //               {/* LEFT */}
// //               <div className="flex-1">
// //                 {/* Tags */}
// //                 <div className="flex flex-wrap items-center gap-3 mb-4">
// //                   <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
// //                     {job.id}
// //                   </span>

// //                   <span
// //                     className={`px-3 py-1 rounded-full text-sm font-medium ${job.priority === "High"
// //                         ? "bg-red-100 text-red-600"
// //                         : job.priority === "Medium"
// //                           ? "bg-orange-100 text-orange-600"
// //                           : "bg-blue-100 text-blue-600"
// //                       }`}
// //                   >
// //                     {job.priority} Priority
// //                   </span>

// //                   <span
// //                     className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === "Completed"
// //                         ? "bg-green-100 text-green-600"
// //                         : job.status === "In Progress"
// //                           ? "bg-blue-100 text-blue-600"
// //                           : "bg-yellow-100 text-yellow-600"
// //                       }`}
// //                   >
// //                     {job.status}
// //                   </span>
// //                 </div>

// //                 <h2 className="text-2xl font-bold mb-2">{job.vehicle}</h2>

// //                 {/* Info */}
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
// //                   <div className="flex items-center gap-3">
// //                     <div className="bg-blue-100 p-3 rounded-xl">
// //                       <Car className="text-blue-600" size={20} />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm text-gray-500">Vehicle Number</p>
// //                       <p className="font-medium">{job.number}</p>
// //                     </div>
// //                   </div>

// //                   <div className="flex items-center gap-3">
// //                     <div className="bg-purple-100 p-3 rounded-xl">
// //                       <User className="text-purple-600" size={20} />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm text-gray-500">Customer</p>
// //                       <p className="font-medium">{job.customer}</p>
// //                     </div>
// //                   </div>

// //                   <div className="flex items-center gap-3">
// //                     <div className="bg-yellow-100 p-3 rounded-xl">
// //                       <Clock3 className="text-yellow-600" size={20} />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm text-gray-500">Assigned Time</p>
// //                       <p className="font-medium">{job.assignedTime}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Issue */}
// //                 <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
// //                   <p className="text-sm text-gray-500 mb-1">Repair Issue</p>
// //                   <p className="text-gray-800">{job.issue}</p>
// //                 </div>
// //               </div>

// //               {/* RIGHT */}
// //               <div className="flex flex-col gap-3 min-w-55">
// //                 <Link
// //                   to={`/mechanic/jobs/:id`}
// //                   className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
// //                 >
// //                   Open Job
// //                   <ArrowRight size={18} />
// //                 </Link>

// //                 <AssignPartsModal />

// //                 <button className="bg-green-100 hover:bg-green-200 text-green-700 px-5 py-3 rounded-xl border border-green-200">
// //                   Mark Complete
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllAssignedJobs;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Car,
//   Clock3,
//   User,
//   Wrench,
//   ArrowRight,
//   CheckCircle2,
//   AlertTriangle,
// } from "lucide-react";

// import AssignPartsModal from "../../Components/AssignPartsModal";
// import { fetchJobs } from "../../supabase/JobMechanic";

// const AllAssignedJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function loadJobs() {
//       try {
//         setLoading(true);
//         const data = await fetchJobs();
//         setJobs(data || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch jobs");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadJobs();
//   }, []);

//   if (loading) return <div className="p-6">Loading jobs…</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!jobs.length) return <div className="p-6">No jobs found.</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-3">
//             <Wrench className="text-blue-600" size={32} />
//             Assigned Jobs
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Track all repair tasks and assigned vehicles.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button className="bg-white border border-gray-200 hover:bg-gray-100 px-5 py-3 rounded-xl shadow-sm">
//             Filter Jobs
//           </button>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow">
//             + Add New Job
//           </button>
//         </div>
//       </div>

//       {/* Jobs List */}
//       <div className="space-y-5">
//         {jobs.map((job, index) => (
//           <div
//             key={job.id || index}
//             className="bg-white border border-gray-200 hover:shadow-md transition rounded-2xl p-6"
//           >
//             <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
//               {/* LEFT */}
//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-3 mb-4">
//                   <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
//                     {job.job_code || job.id}
//                   </span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       job.priority === "High"
//                         ? "bg-red-100 text-red-600"
//                         : job.priority === "Medium"
//                           ? "bg-orange-100 text-orange-600"
//                           : "bg-blue-100 text-blue-600"
//                     }`}
//                   >
//                     {job.priority} Priority
//                   </span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       job.status === "Completed"
//                         ? "bg-green-100 text-green-600"
//                         : job.status === "In Progress"
//                           ? "bg-blue-100 text-blue-600"
//                           : "bg-yellow-100 text-yellow-600"
//                     }`}
//                   >
//                     {job.status}
//                   </span>
//                 </div>

//                 <h2 className="text-2xl font-bold mb-2">{job.vehicle}</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-blue-100 p-3 rounded-xl">
//                       <Car className="text-blue-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Vehicle Number</p>
//                       <p className="font-medium">{job.vehicle_number}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <div className="bg-purple-100 p-3 rounded-xl">
//                       <User className="text-purple-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Customer</p>
//                       <p className="font-medium">{job.customer?.name}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <div className="bg-yellow-100 p-3 rounded-xl">
//                       <Clock3 className="text-yellow-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Assigned Time</p>
//                       <p className="font-medium">{job.assigned_time}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
//                   <p className="text-sm text-gray-500 mb-1">Repair Issue</p>
//                   <p className="text-gray-800">{job.issue}</p>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="flex flex-col gap-3 min-w-55">
//                 <Link
//                   to={`/mechanic/jobs/${job.id}`}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
//                 >
//                   Open Job
//                   <ArrowRight size={18} />
//                 </Link>

//                 <AssignPartsModal />

//                 <button className="bg-green-100 hover:bg-green-200 text-green-700 px-5 py-3 rounded-xl border border-green-200">
//                   Mark Complete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllAssignedJobs;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Clock3,
  User,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import AssignPartsModal from "../../Components/AssignPartsModal";
import { fetchJobs } from "../../supabase/JobMechanic";
import AddNewJob from "../../Components/AddNewJob";

const AllAssignedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await fetchJobs();
        setJobs(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) return <div className="p-6">Loading jobs…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!jobs.length) return <div className="p-6">No jobs found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} />
            Assigned Jobs
          </h1>
          <p className="text-gray-500 mt-2">
            Track all repair tasks and assigned vehicles.
          </p>
        </div>
        <AddNewJob />
      </div>

      {/* Jobs List */}
      <div className="space-y-5">
        {jobs.map((job) => {
          const customer = job.customer || {};
          const vehicle = customer.vehicle_details || {};
          const customerDetails = customer.customer_details || {};
          console.log(customerDetails);
          return (
            <div
              key={job.id}
              className="bg-white border border-gray-200 hover:shadow-md transition rounded-2xl p-6"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                      {job.id}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    {vehicle.model || "Vehicle Model"}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Car className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Number</p>
                        <p className="font-medium">
                          {vehicle.vehicle_number || "N/A"}
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
                          {customerDetails.name || "N/A"}
                        </p>
                        <p className="font-medium">
                          {customerDetails.contact || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-3 rounded-xl">
                        <Clock3 className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Date</p>
                        <p className="font-medium">{job.service_date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Repair Issue</p>
                    <p className="text-gray-800">
                      {job.job_info?.repair_issue || "N/A"}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-3 min-w-55">
                  <Link
                    to={`/mechanic/jobs/${job.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    Open Job
                    <ArrowRight size={18} />
                  </Link>

                  <AssignPartsModal />

                  <button className="bg-green-100 hover:bg-green-200 text-green-700 px-5 py-3 rounded-xl border border-green-200">
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllAssignedJobs;
