import React from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Wrench,
  ArrowLeft,
} from "lucide-react";
import MechanicWorkOrders from "./MechanicWorkOrders";

const MechanicProfile = () => {
  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/car-accessories-with-copy-space_23-2149030401.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Container */}
      <div className="relative max-w-6xl mx-auto space-y-5">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-xl transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* PROFILE CARD */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <User className="text-blue-600" size={26} />
              </div>

              <div>
                <h2 className="text-xl font-bold">Akshay Mechanic</h2>
                <p className="text-sm text-gray-500">Senior Technician</p>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3 mt-5 text-sm">
              <p>
                <Phone className="inline w-4 mr-2 text-green-600" /> +91
                9876543210
              </p>
              <p>
                <Mail className="inline w-4 mr-2 text-purple-600" />{" "}
                akshay@garage.com
              </p>
              <p>
                <MapPin className="inline w-4 mr-2 text-red-500" /> Bhopal
              </p>
              <p>
                <CalendarDays className="inline w-4 mr-2 text-blue-500" /> Since
                2021
              </p>
            </div>
            {/* Specialization */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">Specialization</p>
              <div className="flex flex-wrap gap-2">
                {["Engine Repair", "Brake System", "Diagnostics"].map(
                  (item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
            {/* Button */}
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <Wrench size={18} />
              Edit Profile
            </button>
          </div>

          {/* STATS + SPECIALIZATION */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-gray-500 text-sm">Total Jobs</p>
                <h3 className="text-2xl font-bold">142</h3>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-gray-500 text-sm">Completed</p>
                <h3 className="text-2xl font-bold text-green-600">128</h3>
              </div>
            </div>

            {/* Work Orders (IMPORTANT SECTION) */}
            <div className="bg-white rounded-2xl shadow-sm ">
              <MechanicWorkOrders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;
