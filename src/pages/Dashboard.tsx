import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon, HandHelpingIcon, PackageSearchIcon, SearchIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { items } from '../data/items';
import { claims } from '../data/claims';
import { claimJourney } from '../data/claimJourney';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { ItemDrawer } from '../components/ItemDrawer';
import { categoryIcon, formatDate, formatDateTime, greeting } from '../utils/items';
import type { Item } from '../types/item';

export function Dashboard() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<Item | null>(null);
  const name = session?.name ?? '';
  const firstName = name.split(' ')[0];
  const myReports = items.filter((i) => i.reporter === name);
  const myClaims = claims.filter((c) => c.claimant === name);
  const activeClaim = myClaims.find((c) => c.status === 'pending') ?? myClaims[0];
  const lostReport = myReports.find((i) => i.type === 'lost' && i.status !== 'returned');
  const claimedItem = activeClaim ? items.find((i) => i.id === activeClaim.itemId) : undefined;
  const step = activeClaim ? activeClaim.status === 'approved' ? 4 : 2 : lostReport?.status === 'matched' ? 1 : 0;
  const foundOnCampus = items.filter((i) => i.type === 'found' && (i.status === 'reported' || i.status === 'matched'));

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title={`${greeting()}, ${firstName}!`}
        subtitle="Here’s where your items stand."
        actions={
        <>
            <Link to="/app/report?type=lost" className="btn-primary py-3"><PackageSearchIcon className="h-4 w-4" /> Report lost item</Link>
            <Link to="/app/report?type=found" className="btn-glass py-3"><HandHelpingIcon className="h-4 w-4" /> I found something</Link>
          </>
        } />
      

      {lostReport ?
      <section className="glass p-6 md:p-8" aria-labelledby="case-title">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-white/65">Your active case · {lostReport.id}</p>
              <h2 id="case-title" className="mt-1 text-2xl font-bold tracking-tight">{lostReport.name}</h2>
              <p className="mt-2 max-w-xl text-white/80">
                {step === 2 && claimedItem ?
              `Your claim for “${claimedItem.name}” is being verified. Security is comparing your details with the finder’s notes — we’ll notify you when it’s ready for pickup.` :
              step === 1 ?
              'A similar item was found. Review it and start a claim if it’s yours.' :
              'We’ll notify you as soon as a matching found item is reported.'}
              </p>
            </div>
            {activeClaim && <p className="shrink-0 text-sm text-white/65">Claim {activeClaim.id} · {formatDateTime(activeClaim.submitted)}</p>}
          </div>
          <ol className="mt-8 grid gap-4 sm:grid-cols-5 sm:gap-2" aria-label="Case progress">
            {claimJourney.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.label} className="flex items-start gap-3 sm:flex-col sm:gap-0" aria-current={current ? 'step' : undefined}>
                  <div className="flex items-center sm:w-full">
                    <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done ? 'bg-accent text-secondary' : current ? 'bg-white text-secondary ring-4 ring-accent/40' : 'bg-white/10 text-white/60 ring-1 ring-white/25'}`
                    }>
                    
                      {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                    </span>
                    {i < claimJourney.length - 1 && <span className={`ml-2 hidden h-0.5 flex-1 rounded-full sm:block ${done ? 'bg-accent' : 'bg-white/20'}`} />}
                  </div>
                  <div className="sm:mt-3 sm:pr-2">
                    <p className={`text-sm font-semibold ${current || done ? 'text-white' : 'text-white/60'}`}>{s.label}</p>
                    <p className="mt-0.5 text-xs text-white/60">{s.detail}</p>
                  </div>
                </li>);

          })}
          </ol>
        </section> :

      <section className="glass flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:p-8">
          <div className="flex-1">
            <h2 className="text-lg font-bold">No open cases</h2>
            <p className="mt-1 text-sm text-white/70">Lost something? Report it and FindIt will watch for matching found items.</p>
          </div>
          <Link to="/app/report?type=lost" className="btn-primary">Report lost item</Link>
        </section>
      }

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="glass p-5 md:p-6" aria-labelledby="found-title">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="found-title" className="text-lg font-bold">Found on campus</h2>
            <Link to="/app/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-accent-light">
              Browse all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul>
            {foundOnCampus.map((item, idx) => {
              const Icon = categoryIcon(item.category);
              return (
                <li key={item.id} className={idx > 0 ? 'border-t border-white/10' : ''}>
                  <button
                    onClick={() => setSelected(item)}
                    className="flex w-full items-center gap-4 rounded-xl px-2 py-3.5 text-left transition-colors duration-150 hover:bg-white/10 focus:outline-none focus-visible:bg-white/10">
                    
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/85">
                      <Icon className="h-5 w-5 text-secondary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 truncate text-xs text-white/65">{item.location} · {formatDate(item.date)}</p>
                    </div>
                    <span className="whitespace-nowrap pr-2 text-xs font-semibold text-accent-light">View</span>
                  </button>
                </li>);

            })}
          </ul>
        </section>

        <section className="glass p-5 md:p-6" aria-labelledby="mine-title">
          <h2 id="mine-title" className="text-lg font-bold">My reports</h2>
          {myReports.length === 0 ?
          <div className="glass-soft mt-4 p-5 text-center">
              <SearchIcon className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-2 text-sm text-white/70">You haven’t reported anything yet.</p>
            </div> :

          <ul className="mt-4 space-y-3">
              {myReports.map((item) =>
            <li key={item.id} className="glass-soft p-4">
                  <div className="flex items-center justify-between gap-2">
                    <TypeBadge type={item.type} />
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-xs text-white/65">{item.id} · {item.location} · {formatDate(item.date)}</p>
                </li>
            )}
            </ul>
          }
          <p className="mt-5 text-xs leading-relaxed text-white/65">Picking up an item? Bring your school ID to the Security Office, Admin Building Room 101.</p>
        </section>
      </div>
      <ItemDrawer item={selected} onClose={() => setSelected(null)} />
    </div>);

}