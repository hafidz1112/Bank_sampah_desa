import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'green', trend }) => {
  const colorClasses = {
    green: {
      bg: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300',
      badge: 'bg-emerald-50 text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600',
      border: 'border-amber-100 hover:border-amber-300',
      badge: 'bg-amber-50 text-amber-700'
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-100 hover:border-blue-300',
      badge: 'bg-blue-50 text-blue-700'
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600',
      border: 'border-purple-100 hover:border-purple-300',
      badge: 'bg-purple-50 text-purple-700'
    }
  };

  const style = colorClasses[color] || colorClasses.green;

  return (
    <div className={`bg-white rounded-2xl p-5 border ${style.border} shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${style.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-slate-800 font-sans tracking-tight">{value}</div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>{subtitle}</span>
          {trend && <span className={`font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>{trend}</span>}
        </div>
      )}
    </div>
  );
};
