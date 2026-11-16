import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BellRingIcon, EyeIcon, EyeOffIcon, ListChecksIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Checkbox } from '../components/Checkbox';
import { programs, signupBenefits, yearLevels } from '../data/auth';
import { useCreateAccount } from '../hooks/useCreateAccount';
import { passwordStrength } from '../utils/password';
import type { SignupErrors, SignupForm } from '../hooks/useCreateAccount';

const benefitIcons = [BellRingIcon, ShieldCheckIcon, ListChecksIcon];
const strengthColors = ['bg-white/20', 'bg-danger', 'bg-accent', 'bg-primary', 'bg-success'];

export function CreateAccount() {
  const { form, errors, loading, set, submit } = useCreateAccount();
  const [showPassword, setShowPassword] = useState(false);
  const strength = passwordStrength(form.password);

  return (
    <div className="grid min-h-screen w-full gap-6 p-4 md:p-6 lg:grid-cols-[480px_1fr]">
      <aside className="glass flex flex-col px-8 py-10 lg:px-12 lg:py-12">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={42} />
          <span className="text-xl font-extrabold italic tracking-tight">FINDIT</span>
        </Link>
        <div className="mt-12 lg:mt-16">
          <p className="text-sm font-semibold text-accent-light">Davao del Norte State College · Lost &amp; Found</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight">Create your FindIt account</h1>
          <p className="mt-4 max-w-sm leading-relaxed text-white/75">
            One account for reporting lost items, logging what you find, and claiming what’s yours.
          </p>
        </div>
        <ul className="mt-10 space-y-6">
          {signupBenefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <li key={b.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="h-5 w-5 text-accent-light" />
                </span>
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/70">{b.text}</p>
                </div>
              </li>);

          })}
        </ul>
        <div className="glass-soft mt-10 p-5 lg:mt-auto">
          <p className="text-sm font-semibold">Faculty or staff?</p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">Staff accounts are issued by the Security Office, Admin Building Room 101.</p>
        </div>
      </aside>

      <main className="flex flex-col px-2 py-4 md:px-6 lg:px-10 lg:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeftIcon className="h-4 w-4" /> Back to home
          </Link>
          <p className="text-sm text-white/75">
            Already have an account?{' '}
            <Link to="/#login" className="font-semibold text-accent hover:text-accent-light">Sign in</Link>
          </p>
        </div>

        <div className="glass mx-auto mt-10 w-full max-w-[680px] p-8 lg:mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Student sign up</h2>
          <p className="mt-1 text-sm text-white/70">Use your school details so the Security Office can verify your claims.</p>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="First name" errors={errors}>
                <input id="firstName" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="Nica" autoComplete="given-name" className={cls(errors, 'firstName')} aria-invalid={!!errors.firstName} />
              </Field>
              <Field id="lastName" label="Last name" errors={errors}>
                <input id="lastName" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Hinay" autoComplete="family-name" className={cls(errors, 'lastName')} aria-invalid={!!errors.lastName} />
              </Field>
              <Field id="studentId" label="Student ID" errors={errors}>
                <input id="studentId" value={form.studentId} onChange={(e) => set('studentId', e.target.value)} placeholder="2023-01219" className={cls(errors, 'studentId')} aria-invalid={!!errors.studentId} />
              </Field>
              <Field id="email" label="School email" errors={errors}>
                <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@dnsc.edu.ph" autoComplete="email" className={cls(errors, 'email')} aria-invalid={!!errors.email} />
              </Field>
              <Field id="program" label="Program" errors={errors}>
                <select id="program" value={form.program} onChange={(e) => set('program', e.target.value)} className={cls(errors, 'program')} aria-invalid={!!errors.program}>
                  <option value="">Select program</option>
                  {programs.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field id="year" label="Year level" errors={errors}>
                <select id="year" value={form.year} onChange={(e) => set('year', e.target.value)} className={cls(errors, 'year')} aria-invalid={!!errors.year}>
                  <option value="">Select year</option>
                  {yearLevels.map((y) => <option key={y}>{y}</option>)}
                </select>
              </Field>
              <Field id="password" label="Password" errors={errors}>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" className={`${cls(errors, 'password')} pr-11`} aria-invalid={!!errors.password} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-1.5 top-[13px] rounded-md p-1.5 text-white/60 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <Field id="confirm" label="Confirm password" errors={errors}>
                <input id="confirm" type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Re-enter password" autoComplete="new-password" className={cls(errors, 'confirm')} aria-invalid={!!errors.confirm} />
              </Field>
            </div>

            <div aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((n) =>
                <span key={n} className={`h-1.5 flex-1 rounded-full ${strength.score >= n ? strengthColors[strength.score] : 'bg-white/20'}`} />
                )}
              </div>
              <p className="mt-1.5 text-xs text-white/65">
                Password strength: <span className="font-semibold text-white">{form.password ? strength.label : '—'}</span> · Mix upper &amp; lowercase, numbers and symbols.
              </p>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-white/85">
                <Checkbox checked={form.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-0.5" aria-invalid={!!errors.terms} />
                <span>I agree to the FindIt claim and release policy and confirm my details are accurate.</span>
              </label>
              {errors.terms && <p className="field-error">{errors.terms}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary h-11 w-full">
              {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </main>
    </div>);

}

type FieldProps = {id: keyof SignupForm;label: string;errors: SignupErrors;children: React.ReactNode;};

function Field({ id, label, errors, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {errors[id] && <p className="field-error">{errors[id]}</p>}
    </div>);

}

function cls(errors: SignupErrors, key: keyof SignupForm): string {
  return `glass-input mt-1.5 h-11 ${errors[key] ? 'border-[#FFB4AB]' : ''}`;
}