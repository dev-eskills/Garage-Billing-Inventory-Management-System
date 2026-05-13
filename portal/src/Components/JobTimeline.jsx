import { CheckCircle2, Clock3 } from "lucide-react";
import React from "react";

const JobTimeline = () => {
  const timeline = [
    {
      title: "Job Assigned",
      time: "09:30 AM",
    },
    {
      title: "Vehicle Inspection",
      time: "10:15 AM",
    },
    {
      title: "Parts Added",
      time: "11:00 AM",
    },
    {
      title: "Repair In Progress",
      time: "12:20 PM",
    },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Clock3 className="text-cyan-500" />
        <h2 className="text-xl font-semibold">Service Timeline</h2>
      </div>

      <div className="space-y-5">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <CheckCircle2 className="text-cyan-500" size={18} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-gray-500 text-sm mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTimeline;
