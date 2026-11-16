import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRightIcon, BellRingIcon, CheckIcon, GitCompareArrowsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { items } from '../data/items';
import { matches as initialMatches } from '../data/claims';
import { PageHeader } from '../components/PageHeader';
import { TypeBadge } from '../components/StatusBadge';
import { categoryIcon, formatDate } from '../utils/items';
import type { Item } from '../types/item';

function ItemSide({ item }: {item: Item;}) {
  const Icon = categoryIcon(item.category);
  return (
    <div className="flex min-w-0 flex-1 gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/85">
        <Icon className="h-6 w-6 text-secondary" />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2"><TypeBadge type={item.type} /><span className="text-xs text-white/60">{item.id}</span></div>
        <p className="mt-1.5 font-semibold">{item.name}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-white/70">{item.description}</p>
        <p className="mt-1 text-xs text-white/60">{item.location} · {formatDate(item.date)} · {item.reporter}</p>
      </div>
    </div>);

}

export function Matches() {
  const [list, setList] = useState(initialMatches);
  const [notified, setNotified] = useState<string[]>([]);

  const notify = (id: string, owner: string) => {
    setNotified((n) => [...n, id]);
    toast.success(`${owner} has been notified to verify their claim.`);
  };

  const dismiss = (id: string) => {
    setList((l) => l.filter((m) => m.id !== id));
    toast('Match dismissed');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Possible matches" subtitle="Lost and found reports with overlapping category, location and date. Review before notifying the owner." />
      {list.length === 0 ?
      <div className="glass mt-8 flex flex-col items-center py-16 text-center">
          <GitCompareArrowsIcon className="h-10 w-10 text-accent" />
          <p className="mt-3 font-semibold">You're all caught up</p>
          <p className="mt-1 text-sm text-white/70">New matches appear here as reports come in.</p>
        </div> :

      <ul className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {list.map((m) => {
            const lost = items.find((i) => i.id === m.lostId)!;
            const found = items.find((i) => i.id === m.foundId)!;
            const isNotified = notified.includes(m.id);
            return (
              <motion.li
                key={m.id}
                layout
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="glass p-5 md:p-6">
                
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <ItemSide item={lost} />
                    <span className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <ArrowLeftRightIcon className="h-5 w-5 text-accent" aria-hidden />
                    </span>
                    <ItemSide item={found} />
                  </div>
                  <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold">{m.score}%</span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/15">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${m.score}%` }} />
                      </div>
                    </div>
                    <ul className="flex flex-wrap gap-2" aria-label="Why these match">
                      {m.reasons.map((r) =>
                    <li key={r} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium">{r}</li>
                    )}
                    </ul>
                    <div className="flex gap-2 lg:ml-auto">
                      <button onClick={() => dismiss(m.id)} className="btn-glass">Not a match</button>
                      <button
                      onClick={() => notify(m.id, lost.reporter)}
                      disabled={isNotified}
                      className={isNotified ? 'inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-success-light px-4 py-2.5 text-sm font-semibold text-success' : 'btn-primary'}>
                      
                        {isNotified ? <><CheckIcon className="h-4 w-4" /> Owner notified</> : <><BellRingIcon className="h-4 w-4" /> Notify owner</>}
                      </button>
                    </div>
                  </div>
                </motion.li>);

          })}
          </AnimatePresence>
        </ul>
      }
    </div>);

}