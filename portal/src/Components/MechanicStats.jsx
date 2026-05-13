import React from "react";
import { Wrench, Car, Clock, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Total Jobs",
    value: 42,
    icon: Car,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "In Progress",
    value: 6,
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Completed",
    value: 30,
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Pending",
    value: 6,
    icon: Clock,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

const MechanicStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {item.value}
                </h2>
              </div>

              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <Icon className={item.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MechanicStats;
