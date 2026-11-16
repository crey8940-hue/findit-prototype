import React, { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { analyticsSummary, categoryBreakdown, weeklyReports } from '../data/analytics';
import { PageHeader } from '../components/PageHeader';

type Range = '6w' | 'semester';

const tooltipStyle = {
  background: 'rgba(19,40,72,0.92)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12
};

const axisTick = { fill: 'rgba(255,255,255,0.7)', fontSize: 12 };

export function Analytics() {
  const [range, setRange] = useState<Range>('6w');

  const exportCsv = () => {
    const rows = ['week,lost,found,returned', ...weeklyReports.map((w) => `${w.week},${w.lost},${w.found},${w.returned}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'findit-weekly-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported as CSV.');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="How well lost items are making it back to their owners."
        actions={
        <>
            <div className="glass inline-flex rounded-2xl p-1" role="tablist" aria-label="Date range">
              {([['6w', 'Last 6 weeks'], ['semester', 'This semester']] as const).map(([v, l]) =>
            <button
              key={v}
              role="tab"
              aria-selected={range === v}
              onClick={() => setRange(v)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-150 ${range === v ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}>
              
                  {l}
                </button>
            )}
            </div>
            <button onClick={exportCsv} className="btn-glass py-3"><DownloadIcon className="h-4 w-4" /> Export CSV</button>
          </>
        } />
      

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <section className="glass flex flex-col justify-between p-6 md:p-8" aria-labelledby="recovery-title">
          <div>
            <h2 id="recovery-title" className="text-sm font-medium text-white/75">Recovery rate</h2>
            <p className="mt-2 text-6xl font-extrabold tracking-tight text-accent-light">{analyticsSummary.recoveryRate}%</p>
            <p className="mt-2 text-sm text-white/70">Up {analyticsSummary.recoveryDelta}% from last semester</p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <dt className="text-xs text-white/65">Total reports</dt>
              <dd className="mt-1 text-2xl font-bold">{range === '6w' ? 60 : 142}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/65">Claims approved</dt>
              <dd className="mt-1 text-2xl font-bold">{range === '6w' ? analyticsSummary.claimsApproved : 81}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/65">Avg. return</dt>
              <dd className="mt-1 text-2xl font-bold">{analyticsSummary.avgReturnDays}d</dd>
            </div>
          </dl>
        </section>

        <section className="glass p-6" aria-labelledby="trend-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="trend-title" className="text-lg font-bold">Reports per week</h2>
            <div className="flex gap-4 text-xs text-white/80">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" />Lost</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent-light" />Found</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white" />Returned</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyReports} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="lost" stroke="#60C1E5" strokeWidth={2} fill="#60C1E5" fillOpacity={0.18} isAnimationActive={false} />
                <Area type="monotone" dataKey="found" stroke="#A0E0EF" strokeWidth={2} fill="#A0E0EF" fillOpacity={0.12} isAnimationActive={false} />
                <Area type="monotone" dataKey="returned" stroke="#FFFFFF" strokeWidth={2} fill="#FFFFFF" fillOpacity={0.06} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass p-6" aria-labelledby="cat-title">
        <h2 id="cat-title" className="text-lg font-bold">Most-lost categories</h2>
        <p className="mt-1 text-sm text-white/65">Electronics and IDs make up over half of all reports — worth a reminder in orientation.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryBreakdown} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="category" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
              <Bar dataKey="count" fill="#60C1E5" radius={[8, 8, 0, 0]} maxBarSize={56} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>);

}