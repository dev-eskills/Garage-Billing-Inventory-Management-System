import React from "react";

const QuickActions = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
      <div className="mt-5 grid gap-3">
        <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Create new parts request
        </button>
        <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Mark today's work orders complete
        </button>
        <button className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Review customer feedback
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
