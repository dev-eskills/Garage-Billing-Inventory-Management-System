import { Package } from "lucide-react";
import React from "react";

const MechanicParts = () => {
  const partsUsed = [
    {
      name: "Brake Pads",
      qty: 2,
      price: "2,400",
      status: "Installed",
    },
    {
      name: "Engine Oil",
      qty: 1,
      price: "1,200",
      status: "Pending",
    },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-yellow-500" />
        <h2 className="text-xl font-semibold">Inventory Parts Used</h2>
      </div>

      <div className="space-y-4">
        {partsUsed.map((part, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100"
          >
            <div>
              <h3 className="text-lg font-semibold">{part.name}</h3>

              <p className="text-gray-500 text-sm mt-1">
                Quantity Used: {part.qty}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">₹ {part.price}</span>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  part.status === "Installed"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {part.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicParts;
