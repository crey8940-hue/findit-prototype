import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3Icon, FilePlus2Icon, GitCompareArrowsIcon, LayoutDashboardIcon, SearchIcon, SettingsIcon, ShieldCheckIcon, UsersIcon, XIcon, BoxIcon } from "lucide-react";
import { Logo } from "./Logo";
import { claims, matches } from "../data/claims";
import { useAuth } from "../contexts/AuthContext";
type SidebarProps = {
  open: boolean;
  onClose: () => void;
};
type NavEntry = {
  to: string;
  label: string;
  icon: BoxIcon;
  badge?: number;
};
type NavGroup = {
  title: string;
  entries: NavEntry[];
};
const pendingClaims = claims.filter((c) => c.status === 'pending').length;
const adminNav: NavGroup[] = [{
  title: 'Operations',
  entries: [{
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  }, {
    to: '/admin/browse',
    label: 'Items',
    icon: SearchIcon
  }, {
    to: '/admin/report',
    label: 'Log an item',
    icon: FilePlus2Icon
  }, {
    to: '/admin/matches',
    label: 'Matches',
    icon: GitCompareArrowsIcon,
    badge: matches.length
  }, {
    to: '/admin/claims',
    label: 'Claims',
    icon: ShieldCheckIcon,
    badge: pendingClaims
  }]
}, {
  title: 'Manage',
  entries: [{
    to: '/admin/users',
    label: 'Users',
    icon: UsersIcon
  }, {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3Icon
  }, {
    to: '/admin/settings',
    label: 'Settings',
    icon: SettingsIcon
  }]
}];
const userNav: NavGroup[] = [{
  title: 'Menu',
  entries: [{
    to: '/app',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  }, {
    to: '/app/browse',
    label: 'Browse items',
    icon: SearchIcon
  }, {
    to: '/app/report',
    label: 'Report an item',
    icon: FilePlus2Icon
  }, {
    to: '/app/settings',
    label: 'Settings',
    icon: SettingsIcon
  }]
}];
export function Sidebar({
  open,
  onClose
}: SidebarProps) {
  const {
    session,
    basePath
  } = useAuth();
  const isAdmin = session?.role === 'admin';
  const groups = isAdmin ? adminNav : userNav;
  return <>
      <div className={`fixed inset-0 z-30 bg-secondary-dark/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} aria-hidden />
      <aside className={`glass fixed inset-y-3 left-3 z-40 flex w-64 max-w-[calc(100vw-1.5rem)] shrink-0 flex-col transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:translate-x-0 lg:transition-none ${open ? 'translate-x-0' : 'invisible -translate-x-[110%] lg:visible'}`} aria-label="Main navigation">
        <div className="flex items-center justify-between px-5 pb-6 pt-7">
          <div className="flex items-center gap-3">
            <Logo size={46} />
            <div>
              <p className="text-2xl font-extrabold italic leading-none tracking-tight">FINDIT</p>
              <p className="mt-1 text-xs text-white/70">{isAdmin ? 'Admin console' : 'Lost & Found System'}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3">
          {groups.map((g) => <div key={g.title}>
              <p className="px-3 pb-2 text-xs font-medium text-white/50">{g.title}</p>
              <div className="space-y-1">
                {g.entries.map(({
              to,
              label,
              icon: Icon,
              badge
            }) => <NavLink key={to} to={to} end={to === basePath} onClick={onClose} className={({
              isActive
            }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors duration-150 ${isActive ? 'border border-accent/50 bg-accent/30 text-white shadow-[0_4px_20px_rgba(96,193,229,0.25)]' : 'border border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}>
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 whitespace-nowrap">{label}</span>
                    {badge ? <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-secondary">{badge}</span> : null}
                  </NavLink>)}
              </div>
            </div>)}
        </nav>

        <div className="glass-soft m-3 p-4">
          <p className="text-sm font-semibold">Security Office</p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            Admin Building, Room 101 · Open 7:00 AM – 6:00 PM, Mon–Sat.
          </p>
        </div>
      </aside>
    </>;
}