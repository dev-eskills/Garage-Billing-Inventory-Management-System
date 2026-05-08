// import React, { useMemo, useState } from "react";
// import { Package, Plus, X, Minus, Search } from "lucide-react";

// const availableParts = [
//   { id: 1, name: "Brake Pads", stock: 12, price: 2400 },
//   { id: 2, name: "Engine Oil", stock: 20, price: 1200 },
//   { id: 3, name: "Air Filter", stock: 8, price: 850 },
//   { id: 4, name: "Brake Oil", stock: 15, price: 600 },
//   { id: 5, name: "Clutch Plate", stock: 10, price: 3500 },
//   { id: 6, name: "Coolant", stock: 18, price: 450 },
//   { id: 7, name: "Battery", stock: 5, price: 6200 },
//   { id: 8, name: "Spark Plug", stock: 25, price: 300 },
//   { id: 9, name: "Headlight", stock: 9, price: 1700 },
// ];

// const AssignPartsModal = () => {
//   const [open, setOpen] = useState(false);

//   const [search, setSearch] = useState("");

//   const [selectedParts, setSelectedParts] = useState([]);

//   // Filtered Parts
//   const filteredParts = useMemo(() => {
//     return availableParts.filter((part) =>
//       part.name.toLowerCase().includes(search.toLowerCase()),
//     );
//   }, [search]);

//   // Add Part
//   const handleAddPart = (part) => {
//     const exists = selectedParts.find((p) => p.id === part.id);

//     if (exists) {
//       setSelectedParts((prev) =>
//         prev.map((p) =>
//           p.id === part.id
//             ? {
//                 ...p,
//                 qty: p.qty < part.stock ? p.qty + 1 : p.qty,
//               }
//             : p,
//         ),
//       );
//     } else {
//       setSelectedParts((prev) => [
//         ...prev,
//         {
//           ...part,
//           qty: 1,
//         },
//       ]);
//     }
//   };

//   // Qty Change
//   const handleQtyChange = (id, type) => {
//     setSelectedParts((prev) =>
//       prev
//         .map((part) => {
//           if (part.id === id) {
//             const updatedQty = type === "inc" ? part.qty + 1 : part.qty - 1;

//             return {
//               ...part,
//               qty: updatedQty,
//             };
//           }

//           return part;
//         })
//         .filter((part) => part.qty > 0),
//     );
//   };

//   // Remove
//   const handleRemove = (id) => {
//     setSelectedParts((prev) => prev.filter((part) => part.id !== id));
//   };

//   // Total
//   const total = selectedParts.reduce(
//     (acc, item) => acc + item.qty * item.price,
//     0,
//   );

//   return (
//     <>
//       {/* Open Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className="bg-white hover:bg-gray-100 px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition"
//       >
//         Assign Parts
//       </button>

//       {/* Modal */}
//       {open && (
//         <div className="fixed h-full inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="w-full h-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
//               <div className="flex items-center gap-4">
//                 <div className="bg-yellow-100 p-3 rounded-2xl">
//                   <Package className="text-yellow-600" />
//                 </div>

//                 <div>
//                   <h2 className="text-2xl font-bold">Assign Parts</h2>

//                   <p className="text-sm text-gray-500 mt-1">
//                     Search and assign inventory parts
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setOpen(false)}
//                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
//               {/* LEFT */}
//               <div className="border h-[75vh]  border-gray-200 rounded-3xl overflow-hidden">
//                 {/* Search */}
//                 <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
//                   <div className="relative">
//                     <Search
//                       size={18}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       type="text"
//                       placeholder="Search parts..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Parts List */}
//                 <div className="h-[550px] overflow-y-auto p-4 space-y-4 bg-gray-50">
//                   {filteredParts.length === 0 ? (
//                     <div className="h-full flex items-center justify-center text-gray-400">
//                       No parts found
//                     </div>
//                   ) : (
//                     filteredParts.map((part) => (
//                       <div
//                         key={part.id}
//                         className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h4 className="font-semibold text-lg">
//                               {part.name}
//                             </h4>

//                             <div className="flex items-center gap-4 mt-2">
//                               <span className="text-sm text-gray-500">
//                                 Stock: {part.stock}
//                               </span>

//                               <span className="font-medium">
//                                 ₹ {part.price}
//                               </span>
//                             </div>
//                           </div>

//                           <button
//                             onClick={() => handleAddPart(part)}
//                             className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
//                           >
//                             <Plus size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="border h-[75vh] border-gray-200 rounded-3xl p-5 bg-gray-50 flex flex-col">
//                 <div className="flex items-center justify-between mb-5">
//                   <h3 className="text-lg font-bold">Selected Parts</h3>

//                   <span className="text-sm text-gray-500">
//                     {selectedParts.length} Added
//                   </span>
//                 </div>

//                 <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                   {selectedParts.length === 0 ? (
//                     <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white text-gray-400">
//                       No parts selected
//                     </div>
//                   ) : (
//                     selectedParts.map((part) => (
//                       <div
//                         key={part.id}
//                         className="bg-white border border-gray-200 rounded-2xl p-5"
//                       >
//                         <div className="flex justify-between">
//                           <div>
//                             <h4 className="font-semibold">{part.name}</h4>

//                             <p className="text-sm text-gray-500 mt-1">
//                               ₹ {part.price} each
//                             </p>
//                           </div>

//                           <button
//                             onClick={() => handleRemove(part.id)}
//                             className="text-gray-400 hover:text-red-500"
//                           >
//                             <X size={18} />
//                           </button>
//                         </div>

//                         <div className="flex items-center justify-between mt-5">
//                           <div className="flex items-center gap-3">
//                             <button
//                               onClick={() => handleQtyChange(part.id, "dec")}
//                               className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
//                             >
//                               <Minus size={16} />
//                             </button>

//                             <span className="font-bold w-6 text-center">
//                               {part.qty}
//                             </span>

//                             <button
//                               onClick={() => handleQtyChange(part.id, "inc")}
//                               className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
//                             >
//                               <Plus size={16} />
//                             </button>
//                           </div>

//                           <h4 className="font-bold">
//                             ₹ {part.qty * part.price}
//                           </h4>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="border-t border-gray-200 pt-5 mt-5">
//                   <div className="flex items-center justify-between mb-5">
//                     <div>
//                       <p className="text-sm text-gray-500">Grand Total</p>

//                       <h2 className="text-3xl font-bold">₹ {total}</h2>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold hover:bg-gray-100"
//                     >
//                       Cancel
//                     </button>

//                     <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold">
//                       Assign Parts
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AssignPartsModal;

// Api Implementation with Supabase*********************************************

import React, { useState, useEffect } from "react";
import { Package, Plus, X, Minus, Search } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fetchParts, searchParts } from "../supabase/parts"; // make sure searchParts is exported

const AssignPartsModal = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch parts when modal opens or search changes
  useEffect(() => {
    if (!open) return;

    const getParts = async () => {
      try {
        const parts = debouncedSearch
          ? await searchParts(debouncedSearch)
          : await fetchParts();
        setAvailableParts(parts);
      } catch (error) {
        console.error("Failed to fetch parts:", error.message);
      }
    };

    getParts();
  }, [open, debouncedSearch]);

  // Add part to selected list
  const handleAddPart = (part) => {
    const exists = selectedParts.find((p) => p.id === part.id);
    if (exists) {
      setSelectedParts((prev) =>
        prev.map((p) =>
          p.id === part.id
            ? { ...p, qty: p.qty < part.stock_quantity ? p.qty + 1 : p.qty }
            : p,
        ),
      );
    } else {
      setSelectedParts((prev) => [...prev, { ...part, qty: 1 }]);
    }
  };

  // Update quantity
  const handleQtyChange = (id, type) => {
    setSelectedParts(
      (prev) =>
        prev
          .map((part) => {
            if (part.id === id) {
              let updatedQty = type === "inc" ? part.qty + 1 : part.qty - 1;
              // Ensure quantity does not exceed stock
              if (updatedQty > part.stock_quantity)
                updatedQty = part.stock_quantity;
              return { ...part, qty: updatedQty };
            }
            return part;
          })
          .filter((part) => part.qty > 0), // remove if qty goes below 1
    );
  };

  // Remove part
  const handleRemove = (id) => {
    setSelectedParts((prev) => prev.filter((part) => part.id !== id));
  };

  // Calculate total
  const total = selectedParts.reduce(
    (acc, item) => acc + item.qty * item.sale_price,
    0,
  );

  // Assign parts to Supabase table
  const handleAssignParts = async () => {
    if (!selectedParts.length) return;

    const payload = selectedParts.map((part) => ({
      part_id: part.id,
      quantity: part.qty,
      total_price: part.qty * part.sale_price,
    }));

    const { data, error } = await supabase
      .from("assigned_parts")
      .insert(payload);

    if (error) {
      console.error("Error assigning parts:", error.message);
      alert("Failed to assign parts");
    } else {
      alert("Parts assigned successfully!");
      setSelectedParts([]);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white hover:bg-gray-100 px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition"
      >
        Assign Parts
      </button>

      {open && (
        <div className="fixed h-full inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-2xl">
                  <Package className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Assign Parts</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Search and assign inventory parts
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* LEFT - Parts List */}
              <div className="border h-[75vh] border-gray-200 rounded-3xl overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search parts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Parts */}
                <div className="h-137.5 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {availableParts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No parts found
                    </div>
                  ) : (
                    availableParts.map((part) => (
                      <div
                        key={part.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {/* Part Image */}
                            <img
                              src={part.image_url || "/placeholder.png"}
                              alt={part.part_name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />

                            {/* Part Info */}
                            <div className="flex flex-col">
                              <h4 className="font-semibold text-lg">
                                {part.part_name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">
                                  Stock: {part.stock_quantity}
                                </span>
                                <span className="font-medium">
                                  ₹ {part.sale_price}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddPart(part)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT - Selected Parts */}
              <div className="border h-[75vh] border-gray-200 rounded-3xl p-5 bg-gray-50 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Selected Parts</h3>
                  <span className="text-sm text-gray-500">
                    {selectedParts.length} Added
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {selectedParts.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white text-gray-400">
                      No parts selected
                    </div>
                  ) : (
                    selectedParts.map((part) => (
                      <div
                        key={part.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold">{part.part_name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              ₹ {part.sale_price} each
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemove(part.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQtyChange(part.id, "dec")}
                              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="font-bold w-6 text-center">
                              {part.qty}
                            </span>

                            <button
                              onClick={() => handleQtyChange(part.id, "inc")}
                              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <h4 className="font-bold">
                            ₹ {part.qty * part.sale_price}
                          </h4>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-5 mt-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm text-gray-500">Grand Total</p>
                      <h2 className="text-3xl font-bold">₹ {total}</h2>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignParts}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Assign Parts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignPartsModal;
