import React from 'react';
import { Settings, Wrench, CircleUserRound } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className=" flex  bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2b5ae3] text-white relative overflow-hidden flex-col justify-between p-12 xl:p-20">
        {/* Abstract Background Shapes */}
        <div className="absolute top-50 left-0 w-full h-full overflow-hidden z-0 opacity-100 pointer-events-none">
          <img src="/download.svg" alt="" />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <img
            src="/signup-bg.svg"
            alt="Dashboard Mockup"
            className="max-w-[300px] w-full object-contain relative z-20 drop-shadow-2xl transform rotate-6"
          />
        </div>

        <div className="relative z-10 mt-10">
          <h1 className="text-4xl xl:text-5xl font-bold leading-10 mb-6 tracking-tight">
            Run Your Garage Smarter<br />with <span className="font-extrabold text-white">Socioplace Auto</span>
          </h1>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-22 bg-white relative overflow-y-auto">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
