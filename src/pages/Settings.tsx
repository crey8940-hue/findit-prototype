import React, { useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/PageHeader';

type Prefs = {matchAlerts: boolean;claimUpdates: boolean;weeklyDigest: boolean;sms: boolean;};

const prefLabels: {key: keyof Prefs;title: string;text: string;adminOnly?: boolean;}[] = [
{ key: 'matchAlerts', title: 'Match alerts', text: 'Notify me when a found item looks like something I reported.' },
{ key: 'claimUpdates', title: 'Claim updates', text: 'Tell me when a claim is approved, rejected or ready for pickup.' },
{ key: 'weeklyDigest', title: 'Weekly digest', text: 'A Monday summary of open cases and new found items.', adminOnly: true },
{ key: 'sms', title: 'SMS notifications', text: 'Send urgent updates to my phone as well as email.' }];


export function Settings() {
  const { session, updateProfile } = useAuth();
  const isAdmin = session?.role === 'admin';
  const [name, setName] = useState(session?.name ?? '');
  const [subtitle, setSubtitle] = useState(session?.subtitle ?? '');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('7:00 AM – 6:00 PM, Mon–Sat');
  const [prefs, setPrefs] = useState<Prefs>({ matchAlerts: true, claimUpdates: true, weeklyDigest: isAdmin, sms: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Your name can’t be empty.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: name.trim(), subtitle: subtitle.trim() });
      setSaving(false);
      toast.success('Settings saved.');
    }, 600);
  };

  return (
    <form onSubmit={save} noValidate className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and how FindIt keeps you posted."
        actions={
        <button type="submit" disabled={saving} className="btn-primary py-3">
            {saving && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        } />
      

      <section className="glass grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8" aria-labelledby="profile-title">
        <div>
          <h2 id="profile-title" className="text-lg font-bold">Profile</h2>
          <p className="mt-1 text-sm text-white/65">Shown to the Security Office when you claim an item.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-bold text-secondary">{session?.initials}</span>
            <div>
              <p className="font-semibold">{session?.name}</p>
              <p className="text-sm text-white/65">{isAdmin ? 'Administrator' : 'Student account'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="s-name" className="label">Full name</label>
              <input id="s-name" value={name} onChange={(e) => {setName(e.target.value);setError('');}} className="glass-input mt-1.5 h-11" aria-invalid={!!error} />
              {error && <p className="field-error">{error}</p>}
            </div>
            <div>
              <label htmlFor="s-sub" className="label">{isAdmin ? 'Position' : 'Program & section'}</label>
              <input id="s-sub" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="glass-input mt-1.5 h-11" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="s-phone" className="label">Mobile number <span className="font-normal text-white/60">(optional)</span></label>
              <input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09XX XXX XXXX" className="glass-input mt-1.5 h-11" />
            </div>
          </div>
        </div>
      </section>

      <section className="glass grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8" aria-labelledby="notif-title">
        <div>
          <h2 id="notif-title" className="text-lg font-bold">Notifications</h2>
          <p className="mt-1 text-sm text-white/65">Choose what reaches your inbox.</p>
        </div>
        <ul className="divide-y divide-white/10">
          {prefLabels.
          filter((p) => !p.adminOnly || isAdmin).
          map((p) =>
          <li key={p.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm text-white/65">{p.text}</p>
                </div>
                <button
              type="button"
              role="switch"
              aria-checked={prefs[p.key]}
              aria-label={p.title}
              onClick={() => setPrefs((s) => ({ ...s, [p.key]: !s[p.key] }))}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 ${prefs[p.key] ? 'bg-accent' : 'bg-white/20'}`}>
              
                  <span className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ease-out ${prefs[p.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </li>
          )}
        </ul>
      </section>

      {isAdmin &&
      <section className="glass grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8" aria-labelledby="office-title">
          <div>
            <h2 id="office-title" className="text-lg font-bold">Security Office</h2>
            <p className="mt-1 text-sm text-white/65">Shown to students on pickup instructions.</p>
          </div>
          <div>
            <label htmlFor="s-hours" className="label">Office hours</label>
            <input id="s-hours" value={hours} onChange={(e) => setHours(e.target.value)} className="glass-input mt-1.5 h-11" />
            <p className="mt-2 text-xs text-white/60">Location: Admin Building, Room 101</p>
          </div>
        </section>
      }
    </form>);

}