import React from 'react';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Settings className="text-[#2b5ae3] h-10 w-10" />
      </div>
      <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Admin Settings</h4>
      <p className="text-gray-500 max-w-sm font-medium">
        System configurations will be available here soon.
      </p>
    </div>
  );
};

export default AdminSettings;
