import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, ImagePlusIcon, XIcon } from 'lucide-react';
import { categories, locations } from '../data/items';
import { categoryIcon } from '../utils/items';
import { useAuth } from '../contexts/AuthContext';
import { useScreenInit } from '../hooks/useScreenInit';
import { PageHeader } from '../components/PageHeader';
import type { Category, ItemType } from '../types/item';

type FormState = {name: string;category: Category | '';description: string;location: string;date: string;contact: string;};
type Errors = Partial<Record<keyof FormState, string>>;

const inputCls = 'glass-input mt-1.5 py-2.5';
const empty: FormState = { name: '', category: '', description: '', location: '', date: '2026-11-05', contact: '' };

export function ReportItem() {
  const [params] = useSearchParams();
  const { session, basePath } = useAuth();
  const isAdmin = session?.role === 'admin';
  const screenInit = useScreenInit();
  const [type, setType] = useState<ItemType>(screenInit.reportType ?? (params.get('type') === 'found' ? 'found' : 'lost'));
  const [form, setForm] = useState<FormState>(empty);
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  const set = <K extends keyof FormState,>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Give the item a short name.';
    if (!form.category) next.category = 'Pick a category.';
    if (form.description.trim().length < 15) next.description = 'Add a few more details (15+ characters).';
    if (!form.location) next.location = 'Choose where it was ' + (type === 'lost' ? 'lost.' : 'found.');
    if (!form.contact.trim()) next.contact = 'We need a way to reach you.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('submitting');
    setTimeout(() => setStatus('done'), 900);
  };

  const reset = () => {
    setForm(empty);
    setPhoto(null);
    setStatus('idle');
  };

  if (status === 'done') {
    const nextLink = type === 'lost' ? isAdmin ? '/admin/matches' : '/app' : `${basePath}/browse`;
    const nextLabel = type === 'lost' ? isAdmin ? 'Review matches' : 'Track on dashboard' : 'Browse items';
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="glass mx-auto mt-6 max-w-xl px-6 py-12 text-center">
        
        <CheckCircle2Icon className="mx-auto h-14 w-14 text-accent" />
        <h1 className="mt-4 text-2xl font-bold">Report submitted</h1>
        <p className="mt-2 text-white/75">
          Your {type} report for “{form.name}” is now listed as <span className="font-semibold text-white">IT-1049</span>.
          {type === 'lost' ? ' We will notify you when a matching found item is reported.' : ' Please turn the item over to the Security Office, Admin Building Rm 101.'}
        </p>
        {type === 'lost' &&
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-accent-light p-4 text-left">
            <p className="text-sm font-semibold text-secondary">1 possible match already found</p>
            <p className="mt-0.5 text-sm text-secondary">A similar {form.category || 'item'} was reported near {form.location}.</p>
          </div>
        }
        <div className="mt-8 flex justify-center gap-3">
          <Link to={nextLink} className="btn-primary">{nextLabel}</Link>
          <button onClick={reset} className="btn-glass">Report another</button>
        </div>
      </motion.div>);

  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={isAdmin ? 'Log an item' : 'Report an item'} subtitle="The more specific the details, the faster we can match it." />
      <div className="glass mt-6 grid max-w-md grid-cols-2 gap-2 rounded-2xl p-1.5" role="radiogroup" aria-label="Report type">
        {(['lost', 'found'] as ItemType[]).map((t) =>
        <button
          key={t}
          role="radio"
          aria-checked={type === t}
          onClick={() => setType(t)}
          className={`rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150 ${type === t ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-white/70 hover:text-white'}`}>
          
            {isAdmin ? `${t === 'lost' ? 'Lost' : 'Found'} item` : `I ${t} something`}
          </button>
        )}
      </div>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass space-y-5 p-6 md:p-7">
          <div>
            <label htmlFor="name" className="label">Item name</label>
            <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Black Jansport backpack" className={inputCls} aria-invalid={!!errors.name} />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <fieldset>
            <legend className="label">Category</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => {
                const Icon = categoryIcon(c);
                const active = form.category === c;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => set('category', c)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active ? 'border-accent bg-accent/25 text-white' : 'border-white/20 bg-white/5 text-white/80 hover:border-accent/60'}`
                    }>
                    
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-accent-light' : ''}`} />
                    <span className="whitespace-nowrap">{c}</span>
                  </button>);

              })}
            </div>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </fieldset>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Color, brand, marks, contents, stickers…" className={inputCls} aria-invalid={!!errors.description} />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="label">Where was it {type}?</label>
              <select id="location" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} aria-invalid={!!errors.location}>
                <option value="">Select a location</option>
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
              {errors.location && <p className="field-error">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="date" className="label">Date {type}</label>
              <input id="date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label htmlFor="contact" className="label">{isAdmin ? 'Reporter contact (email or phone)' : 'Contact (email or phone)'}</label>
            <input id="contact" value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="you@dnsc.edu.ph" className={inputCls} aria-invalid={!!errors.contact} />
            {errors.contact && <p className="field-error">{errors.contact}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass p-5">
            <p className="label">Photo <span className="font-normal text-white/60">(optional)</span></p>
            {photo ?
            <div className="relative mt-2 overflow-hidden rounded-2xl">
                <img src={photo} alt="Uploaded item preview" className="h-60 w-full object-cover" />
                <button type="button" onClick={() => setPhoto(null)} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-secondary shadow" aria-label="Remove photo">
                  <XIcon className="h-4 w-4" />
                </button>
              </div> :

            <label className="mt-2 flex h-60 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/25 bg-white/5 text-center transition-colors duration-150 hover:border-accent">
                <ImagePlusIcon className="h-8 w-8 text-accent" />
                <span className="mt-2 text-sm font-semibold">Upload a photo</span>
                <span className="mt-0.5 text-xs text-white/60">PNG or JPG, up to 5 MB</span>
                <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhoto(URL.createObjectURL(f));
                }} />
              
              </label>
            }
          </div>
          <div className="glass-soft p-5 text-sm text-white/80">
            <p className="font-semibold text-white">{type === 'lost' ? 'What happens next' : 'After you submit'}</p>
            <p className="mt-1 leading-relaxed">
              {type === 'lost' ?
              'FindIt compares your report with found items by category, location and date, and notifies you of possible matches.' :
              'Bring the item to the Security Office. It stays there until the owner verifies their claim.'}
            </p>
          </div>
          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full py-3">
            {status === 'submitting' ? 'Submitting…' : `Submit ${type} report`}
          </button>
        </div>
      </form>
    </div>);

}