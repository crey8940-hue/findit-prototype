import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export type DonutSlice = {label: string;value: number;color: string;};

type StatusDonutProps = {data: DonutSlice[];centerLabel: string;};

export function StatusDonut({ data, centerLabel }: StatusDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="64%"
              outerRadius="100%"
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}>
              
              {data.map((d) =>
              <Cell key={d.label} fill={d.color} />
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{total}</span>
          <span className="text-xs text-white/75">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {data.map((d) =>
        <li key={d.label} className="grid grid-cols-[1fr_auto_52px] items-center gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-white/90">
              <span className="h-3 w-3 rounded-full" style={{ background: d.color }} aria-hidden />
              {d.label}
            </span>
            <span className="font-semibold">{d.value}</span>
            <span className="text-right text-white/65">({total ? Math.round(d.value / total * 100) : 0}%)</span>
          </li>
        )}
      </ul>
    </div>);

}