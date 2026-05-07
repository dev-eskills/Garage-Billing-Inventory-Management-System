import React from 'react';
import { ShoppingCart } from 'lucide-react';

const AdminVendors = () => {
  return (
    <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="text-[#2b5ae3] h-10 w-10" />
      </div>
      <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Vendors Management</h4>
      <p className="text-gray-500 max-w-sm font-medium">
        Vendor records and tracking will be available here soon.
      </p>
    </div>
  );
};

export default AdminVendors;    