// // // components/AddJobButton.jsx
// // import React, { useState } from "react";
// // import { supabase } from "../lib/supabaseClient";

// // const AddJob = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [jobInfo, setJobInfo] = useState({
// //     customer_id: "",
// //     mechanic_id: "",
// //     service_date: "",
// //     job_info: { status: "pending", repair_issue: "", service_type: "" },
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setJobInfo({ ...jobInfo, [name]: value });
// //   };

// //   const handleRepairIssueChange = (e) => {
// //     setJobInfo({
// //       ...jobInfo,
// //       job_info: { ...jobInfo.job_info, repair_issue: e.target.value },
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase.from("jobs").insert([jobInfo]);
// //       if (error) throw error;
// //       console.log("Job added:", data);
// //       onJobAdded?.(data[0]); // optional callback
// //       setIsOpen(false);
// //       setJobInfo({
// //         customer_id: "",
// //         mechanic_id: "",
// //         service_date: "",
// //         job_info: { status: "pending", repair_issue: "", service_type: "" },
// //       });
// //     } catch (err) {
// //       console.error("Error adding job:", err);
// //       alert("Failed to add job!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Button */}
// //       <button
// //         onClick={() => setIsOpen(true)}
// //         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow"
// //       >
// //         + Add New Job
// //       </button>

// //       {/* Modal */}
// //       {isOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-xl p-6 w-full max-w-lg">
// //             <h2 className="text-2xl font-bold mb-4">Add New Job</h2>
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div>
// //                 <label className="block text-gray-700">Customer ID</label>
// //                 <input
// //                   type="text"
// //                   name="customer_id"
// //                   value={jobInfo.customer_id}
// //                   onChange={handleChange}
// //                   className="w-full border border-gray-300 rounded-lg p-2"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700">Mechanic ID</label>
// //                 <input
// //                   type="text"
// //                   name="mechanic_id"
// //                   value={jobInfo.mechanic_id}
// //                   onChange={handleChange}
// //                   className="w-full border border-gray-300 rounded-lg p-2"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700">Service Date</label>
// //                 <input
// //                   type="date"
// //                   name="service_date"
// //                   value={jobInfo.service_date}
// //                   onChange={handleChange}
// //                   className="w-full border border-gray-300 rounded-lg p-2"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700">Repair Issue</label>
// //                 <input
// //                   type="text"
// //                   value={jobInfo.job_info.repair_issue}
// //                   onChange={handleRepairIssueChange}
// //                   className="w-full border border-gray-300 rounded-lg p-2"
// //                   required
// //                 />
// //               </div>

// //               <div className="flex justify-end gap-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsOpen(false)}
// //                   className="px-4 py-2 rounded-lg border"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
// //                   disabled={loading}
// //                 >
// //                   {loading ? "Adding..." : "Add Job"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default AddJob;

// // components/AddJobButton.jsx
// import React, { useState, useEffect } from "react";
// import { supabase } from "../lib/supabaseClient";
// import { fetchJobs } from "../supabase/JobMechanic"; // your fetchJobs function

// const AddNewJob = ({ onJobAdded }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [mechanics, setMechanics] = useState([]);
//   const [jobInfo, setJobInfo] = useState({
//     customer_id: "",
//     mechanic_id: "",
//     service_date: "",
//     expiry_date: "",
//     job_info: { status: "pending", repair_issue: "", service_type: "" },
//     parts_items: [],
//     extra_service: { amount: 0, description: "" },
//     discount_percentage: 0,
//     total_amount_full_service: 0,
//   });

//   // Load customers and mechanics for dropdowns
//   useEffect(() => {
//     async function loadData() {
//       const { data: custData } = await supabase
//         .from("customers")
//         .select("id, customer_details");
//       setCustomers(custData || []);
//       const { data: mechData } = await supabase
//         .from("profiles")
//         .select("id, full_name");
//       setMechanics(mechData || []);
//     }
//     loadData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJobInfo({ ...jobInfo, [name]: value });
//   };

//   const handleRepairIssueChange = (e) => {
//     setJobInfo({
//       ...jobInfo,
//       job_info: { ...jobInfo.job_info, repair_issue: e.target.value },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("jobs")
//         .insert([jobInfo])
//         .select("*");
//       if (error) throw error;
//       console.log("Job added:", data);
//       onJobAdded?.(data[0]); // optional callback to refresh parent list
//       setIsOpen(false);
//       setJobInfo({
//         customer_id: "",
//         mechanic_id: "",
//         service_date: "",
//         expiry_date: "",
//         job_info: { status: "pending", repair_issue: "", service_type: "" },
//         parts_items: [],
//         extra_service: { amount: 0, description: "" },
//         discount_percentage: 0,
//         total_amount_full_service: 0,
//       });
//     } catch (err) {
//       console.error("Error adding job:", err);
//       alert("Failed to add job!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow"
//       >
//         + Add New Job
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-lg">
//             <h2 className="text-2xl font-bold mb-4">Add New Job</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Customer Dropdown */}
//               <div>
//                 <label className="block text-gray-700">Customer</label>
//                 <select
//                   name="customer_id"
//                   value={jobInfo.customer_id}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 >
//                   <option value="">Select Customer</option>
//                   {customers.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.customer_details.name || c.id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Mechanic Dropdown */}
//               <div>
//                 <label className="block text-gray-700">Mechanic</label>
//                 <select
//                   name="mechanic_id"
//                   value={jobInfo.mechanic_id}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 >
//                   <option value="">Select Mechanic</option>
//                   {mechanics.map((m) => (
//                     <option key={m.id} value={m.id}>
//                       {m.full_name || m.id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-700">Service Date</label>
//                 <input
//                   type="date"
//                   name="service_date"
//                   value={jobInfo.service_date}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiry_date"
//                   value={jobInfo.expiry_date}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Repair Issue</label>
//                 <input
//                   type="text"
//                   value={jobInfo.job_info.repair_issue}
//                   onChange={handleRepairIssueChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 />
//               </div>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 rounded-lg border"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//                   disabled={loading}
//                 >
//                   {loading ? "Adding..." : "Add Job"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddNewJob;

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AddNewJob = ({ onJobAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [jobInfo, setJobInfo] = useState({
    customer_id: "",
    mechanic_id: "",
    service_date: "",
    expiry_date: "",
    job_info: { status: "pending", repair_issue: "", service_type: "" },
    parts_items: [],
    extra_service: { amount: 0, description: "" },
    discount_percentage: 0,
    total_amount_full_service: 0,
  });

  // Load customers and mechanics
  useEffect(() => {
    async function loadData() {
      const { data: custData } = await supabase
        .from("customers")
        .select("id, customer_details");
      setCustomers(custData || []);
      const { data: mechData } = await supabase
        .from("profiles")
        .select("id, full_name");
      setMechanics(mechData || []);
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobInfo({ ...jobInfo, [name]: value });
  };

  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setJobInfo({
      ...jobInfo,
      job_info: { ...jobInfo.job_info, [name]: value },
    });
  };

  const handleExtraServiceChange = (e) => {
    const { name, value } = e.target;
    setJobInfo({
      ...jobInfo,
      extra_service: { ...jobInfo.extra_service, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([jobInfo])
        .select("*");
      if (error) throw error;
      onJobAdded?.(data[0]);
      setIsOpen(false);
      setJobInfo({
        customer_id: "",
        mechanic_id: "",
        service_date: "",
        expiry_date: "",
        job_info: { status: "pending", repair_issue: "", service_type: "" },
        parts_items: [],
        extra_service: { amount: 0, description: "" },
        discount_percentage: 0,
        total_amount_full_service: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add job!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add Job Button */}
      <button
        onClick={() => setIsOpen(true)}
        className=" bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
      >
        + Add New Job
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {" "}
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Add New Job
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              {/* Customer */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Customer
                </label>
                <select
                  name="customer_id"
                  value={jobInfo.customer_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_details.name || c.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mechanic */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Mechanic
                </label>
                <select
                  name="mechanic_id"
                  value={jobInfo.mechanic_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Select Mechanic</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name || m.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Service Date
                  </label>
                  <input
                    type="date"
                    name="service_date"
                    value={jobInfo.service_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={jobInfo.expiry_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Repair Issue */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Repair Issue
                </label>
                <input
                  type="text"
                  name="repair_issue"
                  value={jobInfo.job_info.repair_issue}
                  onChange={handleJobInfoChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              {/* Extra Service */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Extra Service Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="amount"
                    value={jobInfo.extra_service.amount}
                    onChange={handleExtraServiceChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    name="discount_percentage"
                    value={jobInfo.discount_percentage}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Total Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="total_amount_full_service"
                  value={jobInfo.total_amount_full_service}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                >
                  {loading ? "Creating..." : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewJob;
