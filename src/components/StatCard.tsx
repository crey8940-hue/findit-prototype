import React from "react";
import { ArrowDownIcon, ArrowUpIcon, BoxIcon } from "lucide-react";
type StatCardProps = {
  label: string;
  value: string | number;
  icon: BoxIcon;
  delta?: string;
  trend?: 'up' | 'down';
  good?: boolean;
};
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  trend = 'up',
  good = true
}: StatCardProps) {
  const Arrow = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  return <div className="glass flex flex-col p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
          <Icon className="h-6 w-6 text-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/80">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{value}</p>
        </div>
      </div>
      {delta && <span className={`mt-3 inline-flex items-center gap-1 self-end rounded-full px-2.5 py-1 text-xs font-semibold ${good ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
          <Arrow className="h-3.5 w-3.5" /> {delta}
        </span>}
    </div>;
}