import React, { useState } from "react";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const MechanicProfileButton = () => {
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    console.log("Sign out clicked");
    // add your logout logic here (clear token, redirect, etc.)
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-white shadow-sm  rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-9 h-9 rounded-full object-cover"
        />

        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">Akshay</p>
          <p className="text-xs text-slate-500">Mechanic</p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
          <Link
            to={"/mechanic/profile"}
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
            onClick={() => {
              setOpen(false);
              console.log("Go to profile");
              // navigate("/profile")
            }}
          >
            <User size={16} />
            View Profile
          </Link>

          <button
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm text-red-600"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default MechanicProfileButton;
