import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  // const { forgotPassword, forgotPasswordPending } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    // await forgotPassword(email);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2b5ae3] text-white relative overflow-hidden flex-col justify-between px-12 py-10 xl:px-20 xl:py-5">
        <div className="absolute top-50 left-0 w-full h-full overflow-hidden z-0 opacity-100 pointer-events-none">
          <img src="/download.svg" alt="" className="" />
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#2b5ae3] transition-colors mb-6 group">
              <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password?</h2>
            <p className="text-gray-500 font-medium mt-2">No worries, we'll send you reset instructions.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={forgotPasswordPending}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotPasswordPending}
              className="cursor-pointer w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2b5ae3] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
