import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MechanicHeader from "../../Components/MechanicHeader";
import WhatsAppAutoSender from "../../Components/WhatsAppAutoSender";

const MechanicLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen no-scrollbar bg-slate-50 flex flex-col">
      <WhatsAppAutoSender />
      <MechanicHeader 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <main className="no-scrollbar mx-auto w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MechanicLayout;
