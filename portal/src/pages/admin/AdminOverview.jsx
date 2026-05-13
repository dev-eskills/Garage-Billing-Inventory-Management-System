import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  UserSquare2
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

const AdminOverview = () => {
  const { stats, statsLoading } = useDashboard();
console.log("stats from admin state casrds: ",stats)
  if (statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats?.revenue?.toLocaleString()}`, trend: '+12.5%', color: 'blue', icon: TrendingUp },
    { label: 'Total Profit', value: `₹${stats?.profitability?.toLocaleString()}`, trend: '+8.2%', color: 'emerald', icon: DollarSign },
    { label: 'Active Jobs', value: stats?.activeJobs?.toString(), trend: '+4', color: 'indigo', icon: Package },
    { label: 'Completed Jobs', value: stats?.completedJobs?.toString(), trend: '+18%', color: 'green', icon: LayoutDashboard },
    { label: 'Total Customers', value: stats?.customers?.toString(), trend: '+22%', color: 'purple', icon: UserSquare2 },
    { label: 'Inventory Parts', value: stats?.parts?.toString(), trend: 'Stable', color: 'orange', icon: Package },
    { label: 'Total Losses', value: `₹${stats?.losses?.toLocaleString()}`, trend: '-5%', color: 'red', icon: TrendingDown },
    { label: 'Total Purchases', value: `₹${stats?.totalPurchasesAmount?.toLocaleString()}`, trend: '+15%', color: 'amber', icon: ShoppingCart },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
          Welcome back, Admin 👋
        </h3>
        <p className="text-gray-500 font-medium mt-1">
          Here's what's happening with your garage today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  stat.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h4>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 min-h-[300px]">
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Financial Breakdown
          </h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500 uppercase tracking-widest text-[10px]">Revenue Coverage</span>
                <span className="text-blue-600">₹ {stats?.revenue?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500 uppercase tracking-widest text-[10px]">Profit Margin</span>
                <span className="text-emerald-600">₹ {stats?.profitability?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500 uppercase tracking-widest text-[10px]">Expense/Loss Ratio</span>
                <span className="text-red-600">₹ {(stats?.expenses + stats?.losses)?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <LayoutDashboard className="text-[#2b5ae3] h-10 w-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Advanced Analytics</h4>
          <p className="text-gray-500 max-w-sm font-medium">
            Interactive charts for monthly growth and customer acquisition are being processed.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
