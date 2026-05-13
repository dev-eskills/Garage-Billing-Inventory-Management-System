import { User, CalendarDays } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const AssignedMechanicCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { full_name, role } = user.user_metadata;

  // Format the created_at date
  const workingSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
      })
    : null;
  console.log("AssignedMechanicCard - user:", user.user_metadata);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <User className="text-blue-500" />
        <h2 className="text-xl font-semibold">Assigned Mechanic</h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
        <h3 className="text-lg font-semibold">{full_name || user.email}</h3>
        <p className="text-gray-500 capitalize">{role || "Technician"}</p>

        {workingSince && (
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={16} />
            <p className="text-sm">Working Since {workingSince}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedMechanicCard;
