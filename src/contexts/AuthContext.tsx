import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { demoAccounts } from '../data/auth';
import { useScreenInit } from '../hooks/useScreenInit';
import { initialsOf } from '../utils/password';
import type { NewAccount, Role, Session } from '../types/auth';

type AuthValue = {
  session: Session | null;
  basePath: string;
  login: (role: Role) => Session;
  register: (account: NewAccount) => Session;
  updateProfile: (patch: Partial<Pick<Session, 'name' | 'subtitle'>>) => void;
  logout: () => void;
};

const STORAGE_KEY = 'findit-session';
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const screenInit = useScreenInit();
  const [session, setSession] = useState<Session | null>(() => {
    if (screenInit.role) {
      const a = demoAccounts[screenInit.role];
      return { role: screenInit.role, name: a.name, subtitle: a.subtitle, initials: a.initials };
    }
    return readSession();
  });

  const persist = useCallback((next: Session) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return next;
  }, []);

  const login = useCallback(
    (role: Role) => {
      const account = demoAccounts[role];
      return persist({ role, name: account.name, subtitle: account.subtitle, initials: account.initials });
    },
    [persist]
  );

  const register = useCallback(
    (account: NewAccount) =>
    persist({ role: 'user', name: account.name, subtitle: account.subtitle, initials: initialsOf(account.name) }),
    [persist]
  );

  const updateProfile = useCallback((patch: Partial<Pick<Session, 'name' | 'subtitle'>>) => {
    setSession((cur) => {
      if (!cur) return cur;
      const next = { ...cur, ...patch, initials: initialsOf(patch.name ?? cur.name) };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ session, basePath: session?.role === 'admin' ? '/admin' : '/app', login, register, updateProfile, logout }),
    [session, login, register, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Session : null;
  } catch {
    return null;
  }
}