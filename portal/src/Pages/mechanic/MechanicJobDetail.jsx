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
import GenerateInvoiceModel from "../../components/GenerateInvoiceModel";

const MechanicJobDetail = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium border border-yellow-200">
              In Progress
            </span>

            <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium border border-red-200">
              High Priority
            </span>
          </div>

          <h1 className="text-3xl font-bold mt-4">Job Details</h1>

          <p className="text-gray-500 mt-2">
            Complete repair task details and inventory usage.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <AssignPartsModal />

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
              {[
                ["Vehicle Name", "Hyundai Creta"],
                ["Vehicle Number", "MP04AB2211"],
                ["Service Type", "Brake Repair"],
                ["Assigned Date", "07 May 2026"],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <p className="text-sm text-gray-500">{label}</p>

                  <h3 className="text-lg font-semibold mt-2">{value}</h3>
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
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <User className="text-purple-500" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>

                  <h3 className="font-semibold mt-1">Rahul Sharma</h3>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Phone className="text-green-500" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>

                  <h3 className="font-semibold mt-1">+91 9876543210</h3>
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
                Customer reported unusual brake noise and reduced braking
                efficiency. Brake pads need replacement and brake oil inspection
                required.
              </p>
            </div>
          </div>

          {/* Parts Used */}
          <MechanicParts />
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Timeline */}
          <JobTimeline />

          {/* Summary */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-black shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium opacity-80">Estimated Total</p>

                <h2 className="text-4xl font-bold mt-4">₹ 6,800</h2>
              </div>

              <Wrench size={50} />
            </div>

            {/* <button className="mt-6 w-full bg-black text-white hover:bg-gray-900 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300">
              Generate Invoice
              <ArrowRight size={18} />
            </button> */}

            <GenerateInvoiceModel />
          </div>

          {/* Mechanic */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <User className="text-blue-500" />
              <h2 className="text-xl font-semibold">Assigned Mechanic</h2>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-semibold">Akshay Mechanic</h3>

              <p className="text-gray-500 mt-2">Senior Technician</p>

              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <CalendarDays size={16} />
                <p className="text-sm">Working Since 2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicJobDetail;
