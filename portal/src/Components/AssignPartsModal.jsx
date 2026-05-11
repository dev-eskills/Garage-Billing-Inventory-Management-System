// // import React, { useMemo, useState } from "react";
// // import { Package, Plus, X, Minus, Search } from "lucide-react";

// // const availableParts = [
// //   { id: 1, name: "Brake Pads", stock: 12, price: 2400 },
// //   { id: 2, name: "Engine Oil", stock: 20, price: 1200 },
// //   { id: 3, name: "Air Filter", stock: 8, price: 850 },
// //   { id: 4, name: "Brake Oil", stock: 15, price: 600 },
// //   { id: 5, name: "Clutch Plate", stock: 10, price: 3500 },
// //   { id: 6, name: "Coolant", stock: 18, price: 450 },
// //   { id: 7, name: "Battery", stock: 5, price: 6200 },
// //   { id: 8, name: "Spark Plug", stock: 25, price: 300 },
// //   { id: 9, name: "Headlight", stock: 9, price: 1700 },
// // ];

// // const AssignPartsModal = () => {
// //   const [open, setOpen] = useState(false);

// //   const [search, setSearch] = useState("");

// //   const [selectedParts, setSelectedParts] = useState([]);

// //   // Filtered Parts
// //   const filteredParts = useMemo(() => {
// //     return availableParts.filter((part) =>
// //       part.name.toLowerCase().includes(search.toLowerCase()),
// //     );
// //   }, [search]);

// //   // Add Part
// //   const handleAddPart = (part) => {
// //     const exists = selectedParts.find((p) => p.id === part.id);

// //     if (exists) {
// //       setSelectedParts((prev) =>
// //         prev.map((p) =>
// //           p.id === part.id
// //             ? {
// //                 ...p,
// //                 qty: p.qty < part.stock ? p.qty + 1 : p.qty,
// //               }
// //             : p,
// //         ),
// //       );
// //     } else {
// //       setSelectedParts((prev) => [
// //         ...prev,
// //         {
// //           ...part,
// //           qty: 1,
// //         },
// //       ]);
// //     }
// //   };

// //   // Qty Change
// //   const handleQtyChange = (id, type) => {
// //     setSelectedParts((prev) =>
// //       prev
// //         .map((part) => {
// //           if (part.id === id) {
// //             const updatedQty = type === "inc" ? part.qty + 1 : part.qty - 1;

// //             return {
// //               ...part,
// //               qty: updatedQty,
// //             };
// //           }

// //           return part;
// //         })
// //         .filter((part) => part.qty > 0),
// //     );
// //   };

// //   // Remove
// //   const handleRemove = (id) => {
// //     setSelectedParts((prev) => prev.filter((part) => part.id !== id));
// //   };

// //   // Total
// //   const total = selectedParts.reduce(
// //     (acc, item) => acc + item.qty * item.price,
// //     0,
// //   );

// //   return (
// //     <>
// //       {/* Open Button */}
// //       <button
// //         onClick={() => setOpen(true)}
// //         className="bg-white hover:bg-gray-100 px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition"
// //       >
// //         Assign Parts
// //       </button>

// //       {/* Modal */}
// //       {open && (
// //         <div className="fixed h-full inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
// //           <div className="w-full h-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
// //             {/* Header */}
// //             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
// //               <div className="flex items-center gap-4">
// //                 <div className="bg-yellow-100 p-3 rounded-2xl">
// //                   <Package className="text-yellow-600" />
// //                 </div>

// //                 <div>
// //                   <h2 className="text-2xl font-bold">Assign Parts</h2>

// //                   <p className="text-sm text-gray-500 mt-1">
// //                     Search and assign inventory parts
// //                   </p>
// //                 </div>
// //               </div>

// //               <button
// //                 onClick={() => setOpen(false)}
// //                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
// //               >
// //                 <X size={18} />
// //               </button>
// //             </div>

// //             {/* Body */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
// //               {/* LEFT */}
// //               <div className="border h-[75vh]  border-gray-200 rounded-3xl overflow-hidden">
// //                 {/* Search */}
// //                 <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
// //                   <div className="relative">
// //                     <Search
// //                       size={18}
// //                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
// //                     />

// //                     <input
// //                       type="text"
// //                       placeholder="Search parts..."
// //                       value={search}
// //                       onChange={(e) => setSearch(e.target.value)}
// //                       className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Parts List */}
// //                 <div className="h-[550px] overflow-y-auto p-4 space-y-4 bg-gray-50">
// //                   {filteredParts.length === 0 ? (
// //                     <div className="h-full flex items-center justify-center text-gray-400">
// //                       No parts found
// //                     </div>
// //                   ) : (
// //                     filteredParts.map((part) => (
// //                       <div
// //                         key={part.id}
// //                         className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
// //                       >
// //                         <div className="flex items-start justify-between">
// //                           <div>
// //                             <h4 className="font-semibold text-lg">
// //                               {part.name}
// //                             </h4>

// //                             <div className="flex items-center gap-4 mt-2">
// //                               <span className="text-sm text-gray-500">
// //                                 Stock: {part.stock}
// //                               </span>

// //                               <span className="font-medium">
// //                                 ₹ {part.price}
// //                               </span>
// //                             </div>
// //                           </div>

// //                           <button
// //                             onClick={() => handleAddPart(part)}
// //                             className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
// //                           >
// //                             <Plus size={18} />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                 </div>
// //               </div>

// //               {/* RIGHT */}
// //               <div className="border h-[75vh] border-gray-200 rounded-3xl p-5 bg-gray-50 flex flex-col">
// //                 <div className="flex items-center justify-between mb-5">
// //                   <h3 className="text-lg font-bold">Selected Parts</h3>

// //                   <span className="text-sm text-gray-500">
// //                     {selectedParts.length} Added
// //                   </span>
// //                 </div>

// //                 <div className="flex-1 overflow-y-auto space-y-4 pr-2">
// //                   {selectedParts.length === 0 ? (
// //                     <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white text-gray-400">
// //                       No parts selected
// //                     </div>
// //                   ) : (
// //                     selectedParts.map((part) => (
// //                       <div
// //                         key={part.id}
// //                         className="bg-white border border-gray-200 rounded-2xl p-5"
// //                       >
// //                         <div className="flex justify-between">
// //                           <div>
// //                             <h4 className="font-semibold">{part.name}</h4>

// //                             <p className="text-sm text-gray-500 mt-1">
// //                               ₹ {part.price} each
// //                             </p>
// //                           </div>

// //                           <button
// //                             onClick={() => handleRemove(part.id)}
// //                             className="text-gray-400 hover:text-red-500"
// //                           >
// //                             <X size={18} />
// //                           </button>
// //                         </div>

// //                         <div className="flex items-center justify-between mt-5">
// //                           <div className="flex items-center gap-3">
// //                             <button
// //                               onClick={() => handleQtyChange(part.id, "dec")}
// //                               className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
// //                             >
// //                               <Minus size={16} />
// //                             </button>

// //                             <span className="font-bold w-6 text-center">
// //                               {part.qty}
// //                             </span>

// //                             <button
// //                               onClick={() => handleQtyChange(part.id, "inc")}
// //                               className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
// //                             >
// //                               <Plus size={16} />
// //                             </button>
// //                           </div>

// //                           <h4 className="font-bold">
// //                             ₹ {part.qty * part.price}
// //                           </h4>
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                 </div>

// //                 {/* Footer */}
// //                 <div className="border-t border-gray-200 pt-5 mt-5">
// //                   <div className="flex items-center justify-between mb-5">
// //                     <div>
// //                       <p className="text-sm text-gray-500">Grand Total</p>

// //                       <h2 className="text-3xl font-bold">₹ {total}</h2>
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-3">
// //                     <button
// //                       onClick={() => setOpen(false)}
// //                       className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold hover:bg-gray-100"
// //                     >
// //                       Cancel
// //                     </button>

// //                     <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold">
// //                       Assign Parts
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default AssignPartsModal;

import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  X,
  Minus,
  Search,
  Calendar,
  Hash,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useMechanicInventory } from "../hooks/useMechanicInventory";
import { useJobs } from "../hooks/useJobs";
import toast from "react-hot-toast";

const AssignPartsModal = ({ jobId }) => {
  const { user } = useAuth();
  const { mechanicInventory, isInventoryPending } = useMechanicInventory(
    user?.id,
  );
  const { jobDetails, updateJob, isUpdatingJob } = useJobs(user?.id, jobId);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);

  // Filtered parts from inventory
  const filteredParts = useMemo(() => {
    if (!mechanicInventory) return [];
    return mechanicInventory.filter(
      (part) =>
        part.part_name?.toLowerCase().includes(search.toLowerCase()) ||
        part.sku?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [mechanicInventory, search]);

  // Add Part
  const handleAddPart = (part) => {
    const exists = selectedParts.find((p) => p.part_id === part.part_id);

    if (exists) {
      setSelectedParts((prev) =>
        prev.map((p) =>
          p.part_id === part.part_id
            ? { ...p, qty: p.qty < part.total_quantity ? p.qty + 1 : p.qty }
            : p,
        ),
      );
    } else {
      setSelectedParts((prev) => [...prev, { ...part, qty: 1 }]);
    }
  };

  // Qty change
  const handleQtyChange = (id, type) => {
    setSelectedParts((prev) =>
      prev
        .map((part) => {
          if (part.part_id === id) {
            const updatedQty = type === "inc" ? part.qty + 1 : part.qty - 1;
            return { ...part, qty: updatedQty };
          }
          return part;
        })
        .filter((part) => part.qty > 0),
    );
  };

  // Remove part
  const handleRemove = (id) => {
    setSelectedParts((prev) => prev.filter((part) => part.part_id !== id));
  };

  // Total
  const total = selectedParts.reduce(
    (acc, item) => acc + item.qty * Number(item.weighted_avg_unit_price),
    0,
  );

  // Handle Assign Parts click
  const handleAssignParts = async () => {
    if (!jobDetails) {
      toast.error("Job details not loaded yet.");
      return;
    }

    if (!Array.isArray(selectedParts) || selectedParts.length === 0) {
      console.log(
        "Selected Parts is not an array:",
        selectedParts,
        typeof selectedParts,
      );
      toast.error("Please select at least one part!");
      return;
    }

    try {
      // Defensive conversion to array
      const safeSelectedParts = Array.isArray(selectedParts)
        ? selectedParts
        : [];

      // Map selected parts to the required schema
      const newParts = safeSelectedParts.map((p) => ({
        part_id: p.part_id,
        quantity: Number(p.qty),
        part_name: p.part_name,
        unit_price: Number(p.weighted_avg_unit_price),
        total_price: Number(p.weighted_avg_unit_price) * Number(p.qty),
      }));

      if (!Array.isArray(newParts)) {
        console.log("newParts is not an array:", newParts, typeof newParts);
        throw new Error("newParts mapping failed");
      }

      // Merge with existing parts safely
      const existingParts = Array.isArray(jobDetails.parts_items)
        ? jobDetails.parts_items
        : [];

      const mergedPartsMap = new Map();

      existingParts.forEach((part) =>
        mergedPartsMap.set(part.part_id, { ...part }),
      );
      newParts.forEach((part) => {
        if (mergedPartsMap.has(part.part_id)) {
          const existing = mergedPartsMap.get(part.part_id);
          mergedPartsMap.set(part.part_id, {
            ...existing,
            quantity: existing.quantity + part.quantity,
            total_price: existing.total_price + part.total_price,
          });
        } else {
          mergedPartsMap.set(part.part_id, part);
        }
      });

      const updatedParts = Array.from(mergedPartsMap.values());

      await updateJob({
        jobId: jobDetails.id,
        updateData: { parts_items: updatedParts },
      });
      setOpen(false);
      setSelectedParts([]);
    } catch (error) {
      console.error("Assign Parts Error:", error, selectedParts);
    }
  };

  console.log("Mechanic Inventory:", jobDetails);

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white hover:bg-gray-100 px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition"
      >
        Assign Parts
      </button>

      {/* Modal */}
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
              {/* LEFT */}
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

                {/* Parts List */}
                <div className="h-[550px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {isInventoryPending ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={32}
                      />
                      <p className="text-sm text-gray-500 font-medium">
                        Loading your inventory...
                      </p>
                    </div>
                  ) : filteredParts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No parts found
                    </div>
                  ) : (
                    filteredParts.map((part) => (
                      <div
                        key={part.part_id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition flex items-center justify-between"
                      >
                        {/* Left: Image */}
                        <div className="flex items-center gap-4">
                          <img
                            className="h-12 w-12 object-cover rounded-lg"
                            src={part.image_url || "/placeholder.png"}
                            alt={part.part_name}
                          />

                          {/* Middle: Part Info */}
                          <div className="flex flex-col">
                            <h4 className="font-semibold text-lg">
                              {part.part_name}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                Stock: {part.total_quantity}
                              </span>
                              <span className="font-medium">
                                ₹{" "}
                                {Number(
                                  part.weighted_avg_unit_price,
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Add Button */}
                        <button
                          onClick={() => handleAddPart(part)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT */}
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
                        key={part.part_id}
                        className="bg-white border border-gray-200 rounded-2xl p-5"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold">{part.part_name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              ₹{" "}
                              {Number(
                                part.weighted_avg_unit_price,
                              ).toLocaleString()}{" "}
                              each
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(part.part_id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleQtyChange(part.part_id, "dec")
                              }
                              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-6 text-center">
                              {part.qty}
                            </span>
                            <button
                              onClick={() =>
                                handleQtyChange(part.part_id, "inc")
                              }
                              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <h4 className="font-bold">
                            ₹{" "}
                            {(
                              part.qty * Number(part.weighted_avg_unit_price)
                            ).toLocaleString()}
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
                      <h2 className="text-3xl font-bold">
                        ₹ {total.toLocaleString()}
                      </h2>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 border border-gray-300 py-3 rounded-2xl font-semibold hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    {/* <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold">
                      Assign Parts
                    </button> */}
                    <button
                      onClick={handleAssignParts}
                      disabled={isUpdatingJob}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold disabled:opacity-50"
                    >
                      {isUpdatingJob ? "Assigning..." : "Assign Parts"}
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
