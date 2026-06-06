import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
  trend?: string;
  trendUp?: boolean;
}

const bgColorMap = {
  blue: 'bg-blue-50',
  green: 'bg-emerald-50',
  amber: 'bg-amber-50',
  red: 'bg-red-50',
};

const iconColorMap = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
};

export default function StatCard({ title, value, icon, color, trend, trendUp }: StatCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColorMap[color]} ${iconColorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
