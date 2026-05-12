import React from "react";

const recentActivity = [
  { time: "08:20 AM", text: "Assigned brake repair to Sam.", type: "task" },
  { time: "09:10 AM", text: "Updated invoice for WO-1024.", type: "invoice" },
  {
    time: "10:05 AM",
    text: "Created parts request for air filters.",
    type: "parts",
  },
];
const RecentActivities = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
      <p className="mt-2 text-sm text-slate-500">
        Latest updates from your team and tasks.
      </p>

      <div className="mt-6 space-y-4">
        {recentActivity.map((item) => (
          <div
            key={`${item.time}-${item.type}`}
            className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-sm font-semibold text-slate-700">
              {item.time.split(":")[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {item.text}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
