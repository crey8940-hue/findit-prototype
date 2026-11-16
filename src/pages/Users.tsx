import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BanIcon, RotateCcwIcon, SearchIcon, UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { campusUsers } from '../data/users';
import { PageHeader } from '../components/PageHeader';
import { formatDate } from '../utils/items';
import { initialsOf } from '../utils/password';
import type { CampusUser } from '../types/auth';

type RoleFilter = 'All' | CampusUser['role'];

export function Users() {
  const [params] = useSearchParams();
  const [list, setList] = useState<CampusUser[]>(campusUsers);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [role, setRole] = useState<RoleFilter>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter(
      (u) => (role === 'All' || u.role === role) && (!q || `${u.name} ${u.email} ${u.id} ${u.program}`.toLowerCase().includes(q))
    );
  }, [list, query, role]);

  const toggleStatus = (u: CampusUser) => {
    const next = u.status === 'active' ? 'suspended' : 'active';
    setList((l) => l.map((x) => x.id === u.id ? { ...x, status: next } : x));
    toast(next === 'suspended' ? `${u.name} can no longer submit claims.` : `${u.name} has been reinstated.`);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Users" subtitle={`${list.length} people use FindIt · ${list.filter((u) => u.status === 'suspended').length} suspended`} />

      <div className="glass mt-6 flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or ID" aria-label="Search users" className="glass-input h-10 pl-9" />
        </div>
        <div className="inline-flex rounded-xl border border-white/20 bg-white/10 p-1" role="tablist" aria-label="Role">
          {(['All', 'Student', 'Faculty', 'Staff'] as RoleFilter[]).map((r) =>
          <button
            key={r}
            role="tab"
            aria-selected={role === r}
            onClick={() => setRole(r)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors duration-150 ${role === r ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}>
            
              {r}
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ?
      <div className="glass mt-6 flex flex-col items-center py-16 text-center">
          <UsersIcon className="h-10 w-10 text-accent" />
          <p className="mt-3 font-semibold">No users found</p>
          <p className="mt-1 text-sm text-white/70">Try a different name or clear the role filter.</p>
        </div> :

      <div className="glass mt-6 overflow-x-auto p-2 md:p-4">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-white/70">
                <th className="px-3 pb-3 font-medium">Name</th>
                <th className="px-3 pb-3 font-medium">Role</th>
                <th className="px-3 pb-3 text-right font-medium">Reports</th>
                <th className="px-3 pb-3 text-right font-medium">Claims</th>
                <th className="px-3 pb-3 font-medium">Joined</th>
                <th className="px-3 pb-3 font-medium">Status</th>
                <th className="px-3 pb-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {results.map((u) =>
            <tr key={u.id} className="border-t border-white/10">
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-secondary">{initialsOf(u.name)}</span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{u.name}</span>
                        <span className="block truncate text-xs text-white/60">{u.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block">{u.role}</span>
                    <span className="block text-xs text-white/60">{u.program}</span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">{u.reports}</td>
                  <td className="px-3 py-3 text-right font-semibold">{u.claims}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-white/80">{formatDate(u.joined)}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${u.status === 'active' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>{u.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => toggleStatus(u)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10">
                      {u.status === 'active' ? <><BanIcon className="h-3.5 w-3.5" /> Suspend</> : <><RotateCcwIcon className="h-3.5 w-3.5" /> Reinstate</>}
                    </button>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

}