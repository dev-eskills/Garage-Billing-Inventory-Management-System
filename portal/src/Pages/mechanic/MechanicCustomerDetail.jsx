// import React from "react";
// import { Phone, Car, User, Calendar } from "lucide-react";
// import { useCustomers } from "../../hooks/useCustomers";
// import { useParams } from "react-router-dom";

// const MechanicCustomerDetail = () => {
//   const { id } = useParams();

//   console.log("Customer ID from URL:", id);

//   const { getCustomerById } = useCustomers();

//   const {
//     data: customerDetails,
//     isLoading: isCustomerDetailsLoading,
//   } = getCustomerById(id);

//   console.log("Customer Details:", customerDetails);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex items-center gap-2 mb-6">
//         <User className="text-blue-600" />
//         <h2 className="text-xl font-bold text-gray-800">Customer Detail</h2>
//       </div>

//       {isCustomerDetailsLoading ? (
//         <div>Loading...</div>
//       ) : customerDetails ? (
//         <div className="bg-white p-5 rounded-xl shadow">
//           <h3 className="font-semibold">
//             {customerDetails?.customer_details?.name}
//           </h3>

//           <p className="text-sm text-gray-600 flex items-center gap-2">
//             <Phone size={14} />
//             {customerDetails?.customer_details?.contact}
//           </p>

//           <p className="text-sm text-gray-600 flex items-center gap-2">
//             <Car size={14} />
//             {customerDetails?.vehicle_details?.model}
//           </p>

//           <p className="text-xs text-gray-400 flex items-center gap-2">
//             <Calendar size={12} />
//             {new Date(customerDetails?.created_at).toLocaleDateString()}
//           </p>
//         </div>
//       ) : (
//         <div>No customer found</div>
//       )}
//     </div>
//   );
// };

// export default MechanicCustomerDetail;
import React from "react";
import { Phone, Car, User, Calendar, IdCard } from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import { useParams } from "react-router-dom";

const MechanicCustomerDetail = () => {
  const { id } = useParams();

  const { getCustomerById } = useCustomers();

  const { data: customerDetails, isLoading } = getCustomerById(id);
  console.log("Customer Details:", customerDetails);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading customer details...
      </div>
    );
  }

  if (!customerDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No customer found
      </div>
    );
  }

  const {
    customer_details,
    vehicle_details,
    created_at,
    id: customerId,
  } = customerDetails;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <User className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Customer Detail</h2>
        </div>
        <p className="text-sm text-gray-500">
          Detailed information about customer & vehicle
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
              {customer_details?.name?.charAt(0) || "C"}
            </div>

            <h3 className="mt-3 text-xl font-semibold text-gray-800">
              {customer_details?.name}
            </h3>

            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
              <IdCard size={14} />
              {customerId.slice(0, 12)}...
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              <span>{customer_details?.contact}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>Joined: {new Date(created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Vehicle Card */}
        <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Car className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Vehicle Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Vehicle Model</p>
              <p className="text-md font-semibold text-gray-800">
                {vehicle_details?.model}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Vehicle Number</p>
              <p className="text-md font-semibold text-gray-800">
                {vehicle_details?.vehicle_number}
              </p>
            </div>
          </div>

          {/* Optional: Status badge */}
          <div className="mt-6">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
              Active Customer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicCustomerDetail;
