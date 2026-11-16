import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeftIcon, FileTextIcon, SearchIcon, UserIcon, BoxIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { items } from "../data/items";
import { campusUsers } from "../data/users";
import { categoryIcon } from "../utils/items";
type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};
type Result = {
  id: string;
  label: string;
  hint: string;
  icon: BoxIcon;
  to: string;
  group: string;
};
export function CommandPalette({
  open,
  onClose
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const {
    session,
    basePath
  } = useAuth();
  const isAdmin = session?.role === 'admin';
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);
  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const pages: Result[] = [{
      id: 'p-browse',
      label: 'Browse all items',
      hint: 'Page',
      icon: FileTextIcon,
      to: `${basePath}/browse`,
      group: 'Pages'
    }, {
      id: 'p-report',
      label: isAdmin ? 'Log an item' : 'Report an item',
      hint: 'Page',
      icon: FileTextIcon,
      to: `${basePath}/report`,
      group: 'Pages'
    }, ...(isAdmin ? [{
      id: 'p-claims',
      label: 'Claim verification',
      hint: 'Page',
      icon: FileTextIcon,
      to: '/admin/claims',
      group: 'Pages'
    }, {
      id: 'p-analytics',
      label: 'Analytics',
      hint: 'Page',
      icon: FileTextIcon,
      to: '/admin/analytics',
      group: 'Pages'
    }] : [])];
    const itemResults: Result[] = items.map((i) => ({
      id: i.id,
      label: i.name,
      hint: `${i.id} · ${i.location}`,
      icon: categoryIcon(i.category),
      to: `${basePath}/browse?q=${encodeURIComponent(i.name)}`,
      group: 'Items'
    }));
    const userResults: Result[] = isAdmin ? campusUsers.map((u) => ({
      id: u.id,
      label: u.name,
      hint: `${u.role} · ${u.program}`,
      icon: UserIcon,
      to: `/admin/users?q=${encodeURIComponent(u.name)}`,
      group: 'Users'
    })) : [];
    const all = [...pages, ...itemResults, ...userResults];
    if (!q) return [...pages, ...itemResults.slice(0, 4)];
    return all.filter((r) => `${r.label} ${r.hint}`.toLowerCase().includes(q)).slice(0, 8);
  }, [query, basePath, isAdmin]);
  const go = (r: Result) => {
    navigate(r.to);
    onClose();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[index]) go(results[index]);
  };
  return <AnimatePresence>
      {open && <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div className="absolute inset-0 bg-secondary-dark/60 backdrop-blur-sm" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.15
      }} onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label="Search" className="glass relative w-full max-w-xl overflow-hidden rounded-3xl bg-secondary/85" initial={{
        opacity: 0,
        scale: 0.96,
        y: -8
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.96,
        y: -8
      }} transition={{
        duration: 0.18,
        ease: [0.23, 1, 0.32, 1]
      }}>
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <SearchIcon className="h-5 w-5 text-white/70" />
              <input ref={inputRef} value={query} onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }} onKeyDown={onKeyDown} placeholder="Search items, pages, or users…" className="h-14 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/45 focus:outline-none" aria-label="Search" />
              <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-white/70">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-4 py-8 text-center text-sm text-white/60">No results for “{query}”.</li>}
              {results.map((r, i) => {
            const Icon = r.icon;
            const showGroup = i === 0 || results[i - 1].group !== r.group;
            return <li key={r.id}>
                    {showGroup && <p className="px-3 pb-1 pt-2 text-xs font-medium text-white/50">{r.group}</p>}
                    <button role="option" aria-selected={i === index} onMouseEnter={() => setIndex(i)} onClick={() => go(r)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === index ? 'bg-white/15' : ''}`}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="h-4 w-4 text-accent-light" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{r.label}</span>
                        <span className="block truncate text-xs text-white/55">{r.hint}</span>
                      </span>
                      {i === index && <CornerDownLeftIcon className="h-4 w-4 text-white/50" />}
                    </button>
                  </li>;
          })}
            </ul>
          </motion.div>
        </div>}
    </AnimatePresence>;
}