import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2Icon, ShieldCheckIcon, UserRoundIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { demoAccounts } from '../data/auth';
import { useScreenInit } from '../hooks/useScreenInit';
import { Checkbox } from './Checkbox';
import type { Role } from '../types/auth';

type Errors = {id?: string;password?: string;};

const roleIcons = { user: UserRoundIcon, admin: ShieldCheckIcon };

export function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const screenInit = useScreenInit();
  const [role, setRole] = useState<Role>(screenInit.loginRole ?? 'user');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const account = demoAccounts[role];

  const switchRole = (next: Role) => {
    setRole(next);
    setId('');
    setPassword('');
    setErrors({});
  };

  const fillDemo = () => {
    setId(account.demoId);
    setPassword(account.demoPassword);
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!id.trim()) next.id = `Enter your ${account.idLabel.toLowerCase()}.`;else
    if (role === 'admin' && !/@dnsc\.edu\.ph$/i.test(id.trim())) next.id = 'Use your @dnsc.edu.ph staff email.';
    if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const session = login(role);
      setLoading(false);
      toast.success(`Welcome back, ${session.name.split(' ')[0]}.`);
      navigate(role === 'admin' ? '/admin' : '/app');
    }, 700);
  };

  return (
    <div id="login" className="glass scroll-mt-24 p-6 md:p-7">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/10 p-1" role="tablist" aria-label="Sign in as">
        {(['user', 'admin'] as Role[]).map((r) => {
          const Icon = roleIcons[r];
          const active = role === r;
          return (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchRole(r)}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150 ${
              active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-white/70 hover:text-white'}`
              }>
              
              <Icon className="h-4 w-4" /> {demoAccounts[r].tabLabel}
            </button>);

        })}
      </div>
      <h2 className="mt-6 text-xl font-bold">{account.title}</h2>
      <p className="mt-1 text-sm text-white/70">{account.blurb}</p>

      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="login-id" className="label">{account.idLabel}</label>
          <input
            id="login-id"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setErrors((er) => ({ ...er, id: undefined }));
            }}
            placeholder={account.placeholder}
            autoComplete="username"
            className="glass-input mt-1.5 h-11"
            aria-invalid={!!errors.id}
            aria-describedby={errors.id ? 'login-id-error' : undefined} />
          
          {errors.id && <p id="login-id-error" className="field-error">{errors.id}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="label">Password</label>
            <button
              type="button"
              onClick={() => toast('Visit the Security Office or MIS to reset your password.')}
              className="text-xs font-semibold text-accent hover:text-accent-light">
              
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((er) => ({ ...er, password: undefined }));
              }}
              autoComplete="current-password"
              className="glass-input mt-1.5 h-11 pr-11"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined} />
            
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-1.5 top-[13px] rounded-md p-1.5 text-white/60 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p id="login-password-error" className="field-error">{errors.password}</p>}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
          <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Keep me signed in on this device
        </label>
        <button type="submit" disabled={loading} className="btn-primary h-11 w-full">
          {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
          {loading ? 'Signing in…' : role === 'admin' ? 'Sign in to admin console' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-white/65">
        Trying it out?{' '}
        <button type="button" onClick={fillDemo} className="font-semibold text-accent hover:text-accent-light">
          Use the demo {role === 'admin' ? 'admin' : 'student'} account
        </button>
      </p>
      <div className="mt-5 border-t border-white/15 pt-4 text-center text-sm text-white/70">
        {role === 'user' ?
        <>
            New to FindIt?{' '}
            <Link to="/signup" className="font-semibold text-accent hover:text-accent-light">Create an account</Link>
          </> :

        <span className="text-xs">Staff accounts are issued by the Security Office.</span>
        }
      </div>
    </div>);

}