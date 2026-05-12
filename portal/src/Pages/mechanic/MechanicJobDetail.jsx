import React from "react";
import {
  Car,
  User,
  Phone,
  CalendarDays,
  Wrench,
  Package,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import AssignPartsModal from "../../Components/AssignPartsModal";
import JobTimeline from "../../Components/JobTimeline";
import MechanicParts from "./MechanicParts";
import Backbutton from "../../Components/Backbutton";
import { useParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import PartsUsed from "../../Components/Mechanic/Partsused";
import AssignedMechanicCard from "../../Components/Mechanic/AssignedMechanicCard";
import GenerateInvoiceModel from "../../Components/GenerateInvoiceModel";

const MechanicJobDetail = () => {
  const { id } = useParams();
  const { jobDetails, isJobDetailsLoading } = useJobs(null, id);

  return (
    <div className="min-h-screen text-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium border border-yellow-200">
              {jobDetails?.job_info?.status}
            </span>

            {/* <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium border border-red-200">
              High Priority
            </span> */}
          </div>

          <h1 className="text-3xl font-bold mt-4">Job Details</h1>

          <p className="text-gray-500 mt-2">
            Complete repair task details and inventory usage.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <AssignPartsModal jobId={jobDetails?.id} />

          <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold shadow transition">
            Mark Complete
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-6">
          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Car className="text-blue-500" />
              <h2 className="text-xl font-semibold">Vehicle Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobDetails &&
                [
                  [
                    "Vehicle Name",
                    jobDetails.customers?.vehicle_details?.model || "N/A",
                  ],
                  [
                    "Vehicle Number",
                    jobDetails.customers?.vehicle_details?.vehicle_number,
                  ],
                  ["Service Type", jobDetails?.job_info?.service_type],
                  [
                    "Assigned Date",
                    new Date(jobDetails.service_date).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    ),
                  ],
                ].map(([label, value], index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <p className="text-sm text-gray-500">{label}</p>
                    <h3 className="text-lg font-semibold mt-2">
                      {value || "-"}
                    </h3>
                  </div>
                ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-purple-500" />
              <h2 className="text-xl font-semibold">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Customer Name */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <User className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <h3 className="font-semibold mt-1">
                    {jobDetails?.customers?.customer_details?.name || "N/A"}
                  </h3>
                </div>
              </div>

              {/* Contact Number */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Phone className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <h3 className="font-semibold mt-1">
                    {jobDetails?.customers?.customer_details?.contact || "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Repair Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="text-orange-500" />
              <h2 className="text-xl font-semibold">Repair Issue</h2>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-gray-700 leading-7">
                {jobDetails?.job_info?.repair_issue || "N/A"}
              </p>
            </div>
          </div>

          {/* Parts Used */}
          <PartsUsed jobDetails={jobDetails} />
          {/* <MechanicParts /> */}
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Timeline */}
          {/* <JobTimeline /> */}

          {/* Summary */}
          <div className="bg-linear-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-black shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium opacity-80">Estimated Total</p>

                <h2 className="text-4xl font-bold mt-4">
                  ₹{" "}
                  {jobDetails?.total_amount_full_service?.toFixed(2) || "0.00"}
                </h2>
              </div>

              <Wrench size={50} />
            </div>

            <GenerateInvoiceModel jobDetails={jobDetails} />
          </div>

          {/* Mechanic */}

          <AssignedMechanicCard />

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="text-blue-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">
                Extra Service
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              {jobDetails?.extra_service ? (
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">
                    {jobDetails?.extra_service.description}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹ {jobDetails?.extra_service.amount}
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">
                  No extra services added.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicJobDetail;
