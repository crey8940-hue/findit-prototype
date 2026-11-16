import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, CheckCircle2Icon, MapPinIcon, UserIcon, XIcon } from 'lucide-react';
import { StatusBadge, TypeBadge } from './StatusBadge';
import { categoryIcon, formatDate } from '../utils/items';
import { useAuth } from '../contexts/AuthContext';
import type { Item } from '../types/item';

type ItemDrawerProps = {item: Item | null;onClose: () => void;};

export function ItemDrawer({ item, onClose }: ItemDrawerProps) {
  const { basePath } = useAuth();
  const [mode, setMode] = useState<'view' | 'claim' | 'sent'>('view');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMode('view');
    setDetails('');
    setError('');
  }, [item?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.trim().length < 20) {
      setError('Describe at least one identifying detail (20+ characters).');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMode('sent');
    }, 800);
  };

  const Icon = item ? categoryIcon(item.category) : null;
  const claimable = item?.type === 'found' && (item.status === 'reported' || item.status === 'matched');

  return (
    <AnimatePresence>
      {item && Icon &&
      <>
          <motion.div
          className="fixed inset-0 z-40 bg-secondary-dark/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
          className="fixed inset-y-3 right-3 z-50 flex w-[calc(100%-1.5rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-white/15 bg-secondary/90 shadow-2xl backdrop-blur-2xl"
          initial={{ x: '110%' }}
          animate={{ x: 0 }}
          exit={{ x: '110%' }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="text-sm font-medium text-white/65">{item.id}</span>
              <button onClick={onClose} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex h-52 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <Icon className="h-16 w-16 text-accent-light" strokeWidth={1.4} />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <TypeBadge type={item.type} />
                <StatusBadge status={item.status} />
              </div>
              <h2 className="mt-3 text-xl font-bold">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{item.description}</p>
              <dl className="mt-5 space-y-3 text-sm text-white/85">
                <div className="flex items-center gap-3"><MapPinIcon className="h-4 w-4 text-accent" /><dt className="sr-only">Location</dt><dd>{item.location}</dd></div>
                <div className="flex items-center gap-3"><CalendarIcon className="h-4 w-4 text-accent" /><dt className="sr-only">Date</dt><dd>{item.type === 'lost' ? 'Lost' : 'Found'} on {formatDate(item.date)}</dd></div>
                <div className="flex items-center gap-3"><UserIcon className="h-4 w-4 text-accent" /><dt className="sr-only">Reported by</dt><dd>Reported by {item.reporter}</dd></div>
              </dl>

              {mode === 'claim' &&
            <form onSubmit={submitClaim} className="glass-soft mt-6 p-4" noValidate>
                  <label htmlFor="claim-details" className="label">Prove it's yours</label>
                  <p className="mt-1 text-xs text-white/65">Mention details only the owner would know — contents, marks, lock screen. Security will compare them before release.</p>
                  <textarea
                id="claim-details"
                rows={4}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  setError('');
                }}
                className="glass-input mt-3 p-3"
                aria-invalid={!!error}
                aria-describedby={error ? 'claim-error' : undefined} />
              
                  {error && <p id="claim-error" className="field-error">{error}</p>}
                  <div className="mt-3 flex gap-2">
                    <button type="submit" disabled={sending} className="btn-primary">{sending ? 'Submitting…' : 'Submit claim'}</button>
                    <button type="button" onClick={() => setMode('view')} className="btn-glass">Cancel</button>
                  </div>
                </form>
            }

              {mode === 'sent' &&
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="mt-6 flex gap-3 rounded-2xl bg-success-light p-4">
              
                  <CheckCircle2Icon className="h-5 w-5 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-success">Claim submitted</p>
                    <p className="mt-0.5 text-xs text-secondary">Security will verify your details. You'll be notified when the item is ready for pickup at the Admin Building.</p>
                  </div>
                </motion.div>
            }
            </div>
            {mode === 'view' &&
          <div className="border-t border-white/10 px-6 py-4">
                {claimable ?
            <button onClick={() => setMode('claim')} className="btn-primary w-full">This is mine — start a claim</button> :
            item.type === 'lost' && item.status !== 'returned' ?
            <Link to={`${basePath}/report?type=found`} onClick={onClose} className="btn-primary w-full">I found this item</Link> :

            <p className="text-center text-sm text-white/65">This item is no longer available to claim.</p>
            }
              </div>
          }
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}