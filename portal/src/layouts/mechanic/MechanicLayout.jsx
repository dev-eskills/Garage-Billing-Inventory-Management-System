import React from "react";
import { Outlet } from "react-router-dom";
import MechanicProfileButton from "../../Components/MechanicProfileButton";

const MechanicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Shared Header/Navbar for Mechanic */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="font-bold text-slate-900 tracking-tight">
              Garage Mechanic
            </span>
          </div>
          <div className="flex items-center gap-4">
            <MechanicProfileButton />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default MechanicLayout;
