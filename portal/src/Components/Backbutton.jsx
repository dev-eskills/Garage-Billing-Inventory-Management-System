import React from "react";
import { ArrowLeft } from "lucide-react";

const Backbutton = ({ label = "Back", onClick }) => {
  const handleBack = () => {
    if (onClick) return onClick();
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex mb-4 items-center gap-2 text-gray-700 hover:text-black bg-white border border-gray-200 hover:bg-gray-100 px-4 py-2 rounded-xl transition shadow-sm"
    >
      <ArrowLeft size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Backbutton;
