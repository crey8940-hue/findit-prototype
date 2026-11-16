import React, { useState } from 'react';
import { CheckIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { items } from '../data/items';
import { claims as initialClaims } from '../data/claims';
import { PageHeader } from '../components/PageHeader';
import { Checkbox } from '../components/Checkbox';
import { categoryIcon, formatDate, formatDateTime } from '../utils/items';
import type { Claim, ClaimStatus } from '../types/item';

const checklist = ['Claimant presented a valid school ID', 'Identifying details match the finder notes', 'Claimant signed the release log'];

const claimStatusCls: Record<ClaimStatus, string> = {
  pending: 'bg-warning-light text-warning',
  approved: 'bg-success-light text-success',
  rejected: 'bg-white/80 text-secondary'
};

type Filter = 'all' | ClaimStatus;

export function ClaimVerification() {
  const [list, setList] = useState<Claim[]>(initialClaims);
  const [activeId, setActiveId] = useState(initialClaims[0].id);
  const [filter, setFilter] = useState<Filter>('all');
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
  const [note, setNote] = useState('');
  const active = list.find((c) => c.id === activeId)!;
  const item = items.find((i) => i.id === active.itemId)!;
  const Icon = categoryIcon(item.category);
  const checks = checked[active.id] ?? checklist.map(() => false);
  const allChecked = checks.every(Boolean);
  const visible = list.filter((c) => filter === 'all' || c.status === filter);

  const toggle = (idx: number) => setChecked((c) => ({ ...c, [active.id]: checks.map((v, i) => i === idx ? !v : v) }));

  const decide = (status: ClaimStatus) => {
    if (status === 'rejected' && note.trim().length < 5) {
      toast.error('Add a short reason so the claimant knows why.');
      return;
    }
    setList((l) => l.map((c) => c.id === active.id ? { ...c, status } : c));
    setNote('');
    if (status === 'approved') toast.success(`Release approved — ${item.name} returned to ${active.claimant}.`);else
    toast(`Claim ${active.id} rejected. ${active.claimant} will be notified.`);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Claim verification" subtitle="Compare what the claimant knows with what the finder recorded before releasing an item." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="glass p-3">
          <div className="flex gap-1 rounded-xl bg-white/10 p-1" role="tablist" aria-label="Filter claims">
            {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map((f) =>
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-colors duration-150 ${filter === f ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}>
              
                {f}
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-2" aria-label="Claims">
            {visible.length === 0 && <li className="px-3 py-8 text-center text-sm text-white/60">No {filter} claims.</li>}
            {visible.map((c) => {
              const it = items.find((i) => i.id === c.itemId)!;
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    aria-current={isActive}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors duration-150 ${
                    isActive ? 'border-accent/50 bg-accent/25' : 'border-transparent bg-white/5 hover:bg-white/10'}`
                    }>
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-white/70">{c.id}</span>
                      <span className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold capitalize ${claimStatusCls[c.status]}`}>{c.status}</span>
                    </div>
                    <p className="mt-1.5 truncate font-semibold">{it.name}</p>
                    <p className="mt-0.5 text-xs text-white/65">{c.claimant} · {formatDateTime(c.submitted)}</p>
                  </button>
                </li>);

            })}
          </ul>
        </div>

        <section className="glass overflow-hidden" aria-label="Claim details">
          <div className="flex flex-wrap items-center gap-4 border-b border-white/10 p-5 md:p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85"><Icon className="h-7 w-7 text-secondary" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-sm text-white/65">{item.id} · Found at {item.location} · {formatDate(item.date)}</p>
            </div>
            <span className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize ${claimStatusCls[active.status]}`}>{active.status}</span>
          </div>
          <div className="grid md:grid-cols-2">
            <div className="p-5 md:border-r md:border-white/10 md:p-6">
              <p className="text-sm font-semibold">Claimant says</p>
              <p className="mt-0.5 text-xs text-white/60">{active.claimant} · {active.claimantRole}</p>
              <blockquote className="mt-3 rounded-2xl bg-accent-light p-4 text-sm leading-relaxed text-secondary">{active.claimantDetails}</blockquote>
            </div>
            <div className="border-t border-white/10 p-5 md:border-t-0 md:p-6">
              <p className="text-sm font-semibold">Finder recorded</p>
              <p className="mt-0.5 text-xs text-white/60">{item.reporter} · on intake</p>
              <blockquote className="mt-3 rounded-2xl bg-white/85 p-4 text-sm leading-relaxed text-secondary">{active.finderNotes}</blockquote>
            </div>
          </div>
          {active.status === 'pending' ?
          <div className="border-t border-white/10 p-5 md:p-6">
              <p className="text-sm font-semibold">Before release</p>
              <ul className="mt-3 space-y-2.5">
                {checklist.map((label, i) =>
              <li key={label}>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-white/90">
                      <Checkbox checked={checks[i]} onChange={() => toggle(i)} />
                      {label}
                    </label>
                  </li>
              )}
              </ul>
              <label htmlFor="decision-note" className="label mt-5 block">Officer note <span className="font-normal text-white/60">(required to reject)</span></label>
              <textarea id="decision-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. ID number doesn’t match the one inside the wallet" className="glass-input mt-1.5 p-3" />
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => decide('approved')} disabled={!allChecked} className="btn-primary px-5">
                  <CheckIcon className="h-4 w-4" /> Approve &amp; release
                </button>
                <button onClick={() => decide('rejected')} className="btn-glass px-5">
                  <XIcon className="h-4 w-4" /> Reject claim
                </button>
                {!allChecked && <p className="self-center text-xs text-white/65">Complete the checklist to approve.</p>}
              </div>
            </div> :

          <div className="flex items-center gap-3 border-t border-white/10 p-5 md:p-6">
              <ShieldCheckIcon className={`h-5 w-5 ${active.status === 'approved' ? 'text-accent' : 'text-white/60'}`} />
              <p className="text-sm">
                {active.status === 'approved' ? `Released to ${active.claimant}. Recorded in item history.` : 'Claim rejected. The item remains with the Security Office.'}
              </p>
            </div>
          }
        </section>
      </div>
    </div>);

}