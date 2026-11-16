import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarIcon, LayoutGridIcon, ListIcon, MapPinIcon, SearchIcon, SearchXIcon } from 'lucide-react';
import { categories, items, locations } from '../data/items';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { ItemDrawer } from '../components/ItemDrawer';
import { categoryIcon, formatDate } from '../utils/items';
import type { Item } from '../types/item';

type TypeFilter = 'all' | 'lost' | 'found';
type SortKey = 'newest' | 'oldest' | 'name';
type View = 'grid' | 'list';

const selectCls = 'glass-input h-10 w-auto pr-8';

export function BrowseItems() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [type, setType] = useState<TypeFilter>('all');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [view, setView] = useState<View>('grid');
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter(
      (i) =>
      (type === 'all' || i.type === type) && (
      !category || i.category === category) && (
      !location || i.location === location) && (
      !q || `${i.name} ${i.description} ${i.location} ${i.id}`.toLowerCase().includes(q))
    );
    return [...filtered].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) : sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
  }, [query, type, category, location, sort]);

  const clear = () => {
    setQuery('');
    setType('all');
    setCategory('');
    setLocation('');
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Browse items" subtitle="Search every lost and found report on campus." />

      <div className="glass mt-6 flex flex-col gap-3 rounded-2xl p-4 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “wallet”, “blue”, or “Library”"
            aria-label="Search by description"
            className="glass-input h-10 pl-9" />
          
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-xl border border-white/20 bg-white/10 p-1" role="tablist" aria-label="Report type">
            {(['all', 'lost', 'found'] as TypeFilter[]).map((t) =>
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              onClick={() => setType(t)}
              className={`rounded-lg px-3 py-1 text-sm font-medium capitalize transition-colors duration-150 ${type === t ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}>
              
                {t}
              </button>
            )}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectCls} aria-label="Location">
            <option value="">All locations</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectCls} aria-label="Sort by">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/75" aria-live="polite">{results.length} {results.length === 1 ? 'item' : 'items'}</p>
        <div className="inline-flex rounded-xl border border-white/20 bg-white/10 p-1" aria-label="View">
          {([['grid', LayoutGridIcon], ['list', ListIcon]] as const).map(([v, Icon]) =>
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            aria-label={`${v} view`}
            className={`rounded-lg p-1.5 transition-colors duration-150 ${view === v ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
            
              <Icon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ?
      <div className="glass mt-4 flex flex-col items-center py-16 text-center">
          <SearchXIcon className="h-10 w-10 text-accent" />
          <p className="mt-3 font-semibold">No items match your filters</p>
          <p className="mt-1 text-sm text-white/70">Try a broader search or report your item so others can find it.</p>
          <button onClick={clear} className="btn-primary mt-4">Clear filters</button>
        </div> :
      view === 'grid' ?
      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => {
          const Icon = categoryIcon(item.category);
          return (
            <li key={item.id}>
                <button
                onClick={() => setSelected(item)}
                className="glass group flex h-full w-full flex-col overflow-hidden text-left transition-[border-color,background-color] duration-150 hover:border-accent/60 hover:bg-secondary/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                
                  <div className="relative m-3 mb-0 flex h-36 w-[calc(100%-1.5rem)] items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-12 w-12 text-accent-light" strokeWidth={1.4} />
                    <span className="absolute left-3 top-3"><TypeBadge type={item.type} /></span>
                  </div>
                  <div className="flex w-full flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-white/60">{item.category}</p>
                    <h3 className="mt-1 font-semibold">{item.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/70">{item.description}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                      <div className="flex min-w-0 items-center gap-3 text-xs text-white/65">
                        <span className="flex items-center gap-1 truncate"><MapPinIcon className="h-3.5 w-3.5" />{item.location}</span>
                        <span className="flex items-center gap-1 whitespace-nowrap"><CalendarIcon className="h-3.5 w-3.5" />{formatDate(item.date)}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </button>
              </li>);

        })}
        </ul> :

      <ul className="glass mt-4 px-3">
          {results.map((item, idx) => {
          const Icon = categoryIcon(item.category);
          return (
            <li key={item.id} className={idx > 0 ? 'border-t border-white/10' : ''}>
                <button onClick={() => setSelected(item)} className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors duration-150 hover:bg-white/10">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/85"><Icon className="h-5 w-5 text-secondary" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.name}</span>
                    <span className="block truncate text-xs text-white/65">{item.id} · {item.location} · {formatDate(item.date)}</span>
                  </span>
                  <span className="hidden sm:block"><TypeBadge type={item.type} /></span>
                  <StatusBadge status={item.status} />
                </button>
              </li>);

        })}
        </ul>
      }
      <ItemDrawer item={selected} onClose={() => setSelected(null)} />
    </div>);

}