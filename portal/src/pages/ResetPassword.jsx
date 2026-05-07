import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { updatePassword, updatePasswordPending } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await updatePassword(password);
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set New Password</h2>
            <p className="text-gray-500 font-medium mt-2">Please enter your new password below.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={updatePasswordPending}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={updatePasswordPending}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatePasswordPending}
              className="cursor-pointer w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2b5ae3] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {updatePasswordPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
