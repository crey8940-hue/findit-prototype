import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon, MapPinIcon, MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { LoginCard } from '../components/LoginCard';
import { useAuth } from '../contexts/AuthContext';
import { items } from '../data/items';
import { categoryIcon, formatDate } from '../utils/items';

const steps = [
{ title: 'Report it', text: 'Describe what you lost or found — category, place, date and any marks only the owner would know.' },
{ title: 'Get matched', text: 'FindIt compares lost and found reports by category, location and date, and alerts you to likely matches.' },
{ title: 'Verify & pick up', text: 'The Security Office checks your details against the finder’s notes, then releases the item to you.' }];


const recentlyFound = items.filter((i) => i.type === 'found' && (i.status === 'reported' || i.status === 'matched'));

export function Landing() {
  const { session, basePath } = useAuth();
  const { hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const close = () => setMenuOpen(false);
    document.addEventListener('pointerdown', dismiss);
    desktop.addEventListener('change', close);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      desktop.removeEventListener('change', close);
    };
  }, [menuOpen]);
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className="min-h-screen w-full">
      <header ref={header} className="sticky top-0 z-20 px-3 pt-3 md:px-8 md:pt-4"
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false); }}
        onKeyDown={(e) => {
          if (menuOpen && e.key === 'Escape') {
            setMenuOpen(false);
            toggle.current?.focus();
          }
        }}>
        <div className="glass relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <Logo size={38} />
            <span className="text-xl font-extrabold italic tracking-tight">FINDIT</span>
          </Link>
          <button ref={toggle} type="button" aria-controls="site-links" aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-glass min-h-11 md:hidden">
            {menuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />} Menu
          </button>
          <nav id="site-links" aria-label="Site" onClick={() => setMenuOpen(false)}
            className={`${menuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] flex-col gap-1 overflow-y-auto rounded-2xl border border-white/15 bg-secondary-dark p-2 text-sm font-medium shadow-lg [&>a]:min-h-11 [&>a]:content-center md:static md:mt-0 md:flex md:max-h-none md:flex-row md:items-center md:gap-2 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            <a href="#how" className="rounded-lg px-3 py-2 text-white/80 hover:text-white">How it works</a>
            <a href="#found" className="rounded-lg px-3 py-2 text-white/80 hover:text-white">Recently found</a>
            {session ?
            <Link to={basePath} className="btn-glass py-2">
                Go to dashboard <ArrowRightIcon className="h-4 w-4" />
              </Link> :

            <>
                <a href="#login" className="whitespace-nowrap rounded-lg px-3 py-2 font-semibold text-white/90 hover:text-white">Sign in</a>
                <Link to="/signup" className="whitespace-nowrap rounded-xl bg-accent px-3.5 py-2 font-semibold text-secondary transition-colors duration-150 hover:bg-accent-light">Create account</Link>
              </>
            }
          </nav>
        </div>
      </header>

      <section className="px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-accent-light">Davao del Norte State College · Lost &amp; Found</p>
            <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
              Lost something on campus? Let’s get it back.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
              FindIt connects people who lose things with people who find them — and the Security Office makes sure every item goes home to the right owner.
            </p>
            <dl className="glass mt-10 inline-flex flex-wrap gap-x-12 gap-y-6 px-7 py-5">
              <div>
                <dt className="text-sm text-white/70">Recovery rate this semester</dt>
                <dd className="mt-1 text-4xl font-extrabold text-accent-light">68%</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">Average time to return</dt>
                <dd className="mt-1 text-4xl font-extrabold text-accent-light">2.4 days</dd>
              </div>
            </dl>
          </div>
          <div className="mx-auto w-full max-w-md lg:ml-auto">
            <LoginCard />
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-20" aria-labelledby="how-title">
        <div className="glass mx-auto max-w-7xl p-8 md:p-12">
          <h2 id="how-title" className="text-2xl font-bold tracking-tight md:text-3xl">How FindIt works</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
            {steps.map((s, i) =>
            <li key={s.title} className={`md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? 'md:border-l md:border-white/15' : ''}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-secondary">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{s.text}</p>
              </li>
            )}
          </ol>
        </div>
      </section>

      <section id="found" className="scroll-mt-24 px-4 pb-20 md:px-8" aria-labelledby="found-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="found-title" className="text-2xl font-bold tracking-tight md:text-3xl">Recently found on campus</h2>
            <p className="mt-3 max-w-sm leading-relaxed text-white/75">
              These items are with the Security Office now. Recognize one? Sign in to start a claim — you’ll be asked for details only the owner would know.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#login" className="btn-primary">Sign in to claim <ArrowRightIcon className="h-4 w-4" /></a>
              <Link to="/signup" className="btn-glass">Create an account</Link>
            </div>
          </div>
          <ul className="glass px-5">
            {recentlyFound.map((item, idx) => {
              const Icon = categoryIcon(item.category);
              return (
                <li key={item.id} className={`flex items-center gap-4 py-4 ${idx > 0 ? 'border-t border-white/10' : ''}`}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Icon className="h-5 w-5 text-accent-light" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-white/65">
                      <span className="flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" />{item.location}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" />{formatDate(item.date)}</span>
                    </p>
                  </div>
                  <span className="hidden text-xs font-medium text-white/65 sm:block">{item.category}</span>
                </li>);

            })}
          </ul>
        </div>
      </section>

      <footer className="px-4 pb-8 md:px-8">
        <div className="glass mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <p className="font-bold">FindIt</p>
              <p className="text-xs text-white/60">DNSC Lost &amp; Found</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            Security Office · Admin Building, Room 101 · Open 7:00 AM – 6:00 PM, Monday to Saturday.
          </p>
        </div>
      </footer>
    </div>);

}
