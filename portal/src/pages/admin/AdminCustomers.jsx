import React from 'react';
import { UserSquare2 } from 'lucide-react';

const AdminCustomers = () => {
  return (
    <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <UserSquare2 className="text-[#2b5ae3] h-10 w-10" />
      </div>
      <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Customer Management</h4>
      <p className="text-gray-500 max-w-sm font-medium">
        Customer profiles and history will be available here soon.
      </p>
    </div>
  );
};

export default AdminCustomers;
