import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, ChevronDownIcon, LogOutIcon, MenuIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '../data/notifications';

type TopbarProps = {onMenu: () => void;onSearch: () => void;};
type Panel = 'none' | 'notifications' | 'profile';

const popover = {
  initial: { opacity: 0, y: -4, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.97 },
  transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] }
};

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

export function Topbar({ onMenu, onSearch }: TopbarProps) {
  const navigate = useNavigate();
  const { session, basePath, logout } = useAuth();
  const [panel, setPanel] = useState<Panel>('none');
  const list = notifications[session?.role ?? 'user'];
  const [unread, setUnread] = useState<number[]>(list.map((n) => n.id));
  const ref = useRef<HTMLDivElement>(null);
  const toggle = (p: Panel) => setPanel((cur) => cur === p ? 'none' : p);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPanel('none');
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const signOut = () => {
    logout();
    toast('You have been signed out.');
    navigate('/');
  };

  return (
    <header className="relative z-20 flex shrink-0 items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-4 sm:pt-4 md:px-6 lg:px-0 lg:pt-0" ref={ref}>
      <button onClick={onMenu} className="glass-soft flex h-11 w-11 shrink-0 items-center justify-center text-white lg:hidden" aria-label="Open menu">
        <MenuIcon className="h-5 w-5" />
      </button>

      <button
        onClick={onSearch}
        className="glass flex h-11 min-w-0 max-w-2xl sm:h-14 flex-1 items-center gap-3 rounded-2xl px-3 sm:px-5 text-left text-white/60 transition-colors duration-150 hover:bg-secondary/55"
        aria-label="Search items, reports or users">
        
        <SearchIcon className="h-5 w-5 shrink-0 text-white/80" />
        <span className="hidden flex-1 truncate sm:block text-sm md:text-[15px]">Search for items, reports, or users…</span>
        <span className="truncate text-sm sm:hidden">Search</span>
        <kbd className="hidden rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white/80 sm:block">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="sm:relative">
          <button
            onClick={() => toggle('notifications')}
            className="glass relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-white transition-colors duration-150 hover:bg-secondary/55"
            aria-label={`Notifications, ${unread.length} unread`}
            aria-expanded={panel === 'notifications'}>
            
            <BellIcon className="h-5 w-5" />
            {unread.length > 0 && <span className="absolute right-2 top-2 sm:right-3.5 sm:top-3.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-secondary" />}
          </button>
          <AnimatePresence>
            {panel === 'notifications' &&
            <motion.div {...popover} className="glass absolute inset-x-3 top-full mt-2 max-h-[65dvh] overflow-y-auto sm:left-auto sm:right-0 sm:w-80 origin-top-right rounded-2xl bg-secondary/85 p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unread.length > 0 &&
                <button onClick={() => setUnread([])} className="text-xs font-semibold text-accent hover:text-accent-light">
                      Mark all read
                    </button>
                }
                </div>
                {list.map((n) => {
                const isUnread = unread.includes(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => setUnread((u) => u.filter((id) => id !== n.id))}
                    className="flex w-full gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/10">
                    
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isUnread ? 'bg-accent' : 'bg-transparent'}`} aria-hidden />
                      <span>
                        <span className={`block text-sm ${isUnread ? 'font-semibold text-white' : 'text-white/75'}`}>{n.text}</span>
                        <span className="mt-0.5 block text-xs text-white/55">{n.time}</span>
                      </span>
                    </button>);

              })}
              </motion.div>
            }
          </AnimatePresence>
        </div>

        <span className="hidden h-10 w-px bg-white/20 md:block" aria-hidden />

        <div className="sm:relative">
          <button
            onClick={() => toggle('profile')}
            aria-expanded={panel === 'profile'}
            aria-label="Account menu"
            className="flex items-center gap-3 rounded-2xl py-1 pl-1 pr-2 transition-colors duration-150 hover:bg-white/10">
            
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-secondary ring-2 ring-white/40">
              {session?.initials}
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-base font-semibold">{session?.name}</span>
              <span className="block text-xs text-white/70">{session?.subtitle}</span>
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-white/80 md:block" />
          </button>
          <AnimatePresence>
            {panel === 'profile' &&
            <motion.div {...popover} className="glass absolute right-3 top-full mt-2 w-56 sm:right-0 origin-top-right rounded-2xl bg-secondary/85 p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">{session?.name}</p>
                  <p className="text-xs text-white/60">{session?.role === 'admin' ? 'Administrator' : 'Student account'}</p>
                </div>
                <Link
                to={`${basePath}/settings`}
                onClick={() => setPanel('none')}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/10">
                
                  <SettingsIcon className="h-4 w-4 text-white/70" /> Settings
                </Link>
                <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/10">
                  <LogOutIcon className="h-4 w-4 text-white/70" /> Sign out
                </button>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </header>);

}