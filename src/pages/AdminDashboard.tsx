import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  GitCompareArrowsIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  ZapIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { items, locations } from '../data/items';
import { claims, matches } from '../data/claims';
import { activity } from '../data/activity';
import { analyticsSummary } from '../data/analytics';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { StatusDonut } from '../components/StatusDonut';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { ItemDrawer } from '../components/ItemDrawer';
import { categoryIcon, formatDate, formatDateTime, greeting } from '../utils/items';
import type { Item, ItemStatus } from '../types/item';

const pipeline: {status: ItemStatus;label: string;color: string;}[] = [
{ status: 'returned', label: 'Returned', color: '#005A9C' },
{ status: 'matched', label: 'Matched', color: '#60C1E5' },
{ status: 'claimed', label: 'For claim', color: '#FDE3B5' },
{ status: 'reported', label: 'Reported', color: '#A0E0EF' },
{ status: 'unresolved', label: 'Unresolved', color: '#C3CEDB' }];


export function AdminDashboard() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<Item | null>(null);
  const pending = claims.filter((c) => c.status === 'pending');
  const recent = items.slice(0, 6);
  const returned = items.filter((i) => i.status === 'returned').length;
  const byLocation = locations.
  map((l) => ({ location: l, count: items.filter((i) => i.location === l).length })).
  filter((l) => l.count > 0).
  sort((a, b) => b.count - a.count);
  const maxLocation = byLocation[0]?.count ?? 1;
  const lastName = session?.name.split(' ').slice(-1)[0];
  const donut = pipeline.map((p) => ({ label: p.label, color: p.color, value: items.filter((i) => i.status === p.status).length }));

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title={`${greeting()}, Officer ${lastName}!`}
        subtitle={`${pending.length} claims are waiting for verification and ${matches.length} new matches need a look.`}
        showDate />
      

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Items reported" value={items.length} icon={PackageIcon} delta="+12%" />
        <StatCard label="Items returned" value={returned} icon={CheckCircle2Icon} delta="+18%" />
        <StatCard label="Pending claims" value={pending.length} icon={ShieldCheckIcon} delta="+1 today" good={false} />
        <StatCard label="Avg. time to return" value={`${analyticsSummary.avgReturnDays} days`} icon={ClockIcon} delta="-26%" trend="down" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="glass p-5 md:p-6" aria-labelledby="recent-title">
          <div className="flex items-center justify-between">
            <h2 id="recent-title" className="flex items-center gap-3 text-xl font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><FileTextIcon className="h-5 w-5" /></span>
              Recent reports
            </h2>
            <Link to="/admin/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-accent-light">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-white/70">
                  <th className="pb-3 pl-2 font-medium">Item</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 pr-2 text-right font-medium">Date reported</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => {
                  const Icon = categoryIcon(item.category);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelected(item)}
                      tabIndex={0}
                      className="cursor-pointer border-t border-white/10 transition-colors duration-150 hover:bg-white/5 focus:bg-white/10 focus:outline-none">
                      
                      <td className="py-3 pl-2">
                        <span className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/85">
                            <Icon className="h-5 w-5 text-secondary" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{item.name}</span>
                            <span className="block text-xs text-white/60">{item.id} · {item.location}</span>
                          </span>
                        </span>
                      </td>
                      <td className="py-3"><TypeBadge type={item.type} /></td>
                      <td className="py-3"><StatusBadge status={item.status} /></td>
                      <td className="whitespace-nowrap py-3 pr-2 text-right text-white/85">{formatDate(item.date)}</td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="glass p-5 md:p-6" aria-labelledby="status-title">
            <h2 id="status-title" className="flex items-center gap-3 text-lg font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><BarChart3Icon className="h-5 w-5" /></span>
              Item status overview
            </h2>
            <div className="mt-5">
              <StatusDonut data={donut} centerLabel="Total items" />
            </div>
          </section>

          <section className="glass p-5 md:p-6" aria-labelledby="quick-title">
            <h2 id="quick-title" className="flex items-center gap-2 text-lg font-bold">
              <ZapIcon className="h-5 w-5 text-accent-light" /> Quick actions
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Link to="/admin/report?type=found" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary px-2 py-4 text-center text-sm font-semibold shadow-lg shadow-primary/30 transition-colors duration-150 hover:bg-primary-dark">
                <PlusIcon className="h-6 w-6" /> Log item
              </Link>
              <Link to="/admin/browse" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-2 py-4 text-center text-sm font-semibold transition-colors duration-150 hover:bg-white/20">
                <SearchIcon className="h-6 w-6" /> Search item
              </Link>
              <Link to="/admin/claims" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-2 py-4 text-center text-sm font-semibold transition-colors duration-150 hover:bg-white/20">
                <ShieldCheckIcon className="h-6 w-6" /> Verify claim
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="glass p-5 md:p-6" aria-labelledby="attention-title">
          <h2 id="attention-title" className="text-lg font-bold">Needs your attention</h2>
          <ul className="mt-4 space-y-2.5">
            {pending.map((c) => {
              const item = items.find((i) => i.id === c.itemId);
              return (
                <li key={c.id}>
                  <Link to="/admin/claims" className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5 transition-colors duration-150 hover:bg-white/20">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-light text-secondary">
                      <ShieldCheckIcon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">Verify claim · {item?.name}</span>
                      <span className="block text-xs text-white/65">{c.claimant} · {formatDateTime(c.submitted)}</span>
                    </span>
                  </Link>
                </li>);

            })}
            <li>
              <Link to="/admin/matches" className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5 transition-colors duration-150 hover:bg-white/20">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-secondary">
                  <GitCompareArrowsIcon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{matches.length} possible matches to review</span>
                  <span className="block text-xs text-white/65">Lost and found reports with similar details</span>
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="glass p-5 md:p-6" aria-labelledby="activity-title">
          <h2 id="activity-title" className="text-lg font-bold">Activity log</h2>
          <ol className="mt-4 border-l border-white/20">
            {activity.map((a) =>
            <li key={a.id} className="relative pb-4 pl-5 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-secondary/60" aria-hidden />
                <p className="text-sm text-white/90"><span className="font-semibold text-white">{a.actor}</span> {a.action}</p>
                <p className="mt-0.5 text-xs text-white/55">{formatDateTime(a.time)}</p>
              </li>
            )}
          </ol>
        </section>

        <section className="glass p-5 md:p-6" aria-labelledby="hotspots-title">
          <h2 id="hotspots-title" className="text-lg font-bold">Reports by location</h2>
          <p className="mt-1 text-sm text-white/65">Where items go missing most — useful for patrol and signage.</p>
          <ul className="mt-5 space-y-3.5">
            {byLocation.map((l) =>
            <li key={l.location} className="grid grid-cols-[110px_1fr_24px] items-center gap-3 text-sm">
                <span className="truncate text-white/90">{l.location}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${l.count / maxLocation * 100}%` }} />
                </span>
                <span className="text-right font-semibold">{l.count}</span>
              </li>
            )}
          </ul>
        </section>
      </div>

      <ItemDrawer item={selected} onClose={() => setSelected(null)} />
    </div>);

}