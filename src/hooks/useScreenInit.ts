import { useMemo } from 'react';
import { screenStates } from '../data/screens';

export type ScreenInit = {
  role?: 'user' | 'admin';
  loginRole?: 'user' | 'admin';
  reportType?: 'lost' | 'found';
};

// Reads optional URL overrides (e.g. ?role=admin, ?loginRole=admin, ?reportType=found)
// and canvas screen ids (?mp_screen=<id>) so any screen can be opened directly.
export function useScreenInit(): ScreenInit {
  return useMemo(() => {
    if (typeof window === 'undefined') return {};
    const p = new URLSearchParams(window.location.search);
    const canvas: ScreenInit = screenStates[p.get('mp_screen') ?? ''] ?? {};
    const pick = <T extends string,>(key: string, allowed: T[]): T | undefined => {
      const v = p.get(key);
      return v && (allowed as string[]).includes(v) ? v as T : undefined;
    };
    return {
      role: pick('role', ['user', 'admin']) ?? canvas.role,
      loginRole: pick('loginRole', ['user', 'admin']) ?? canvas.loginRole,
      reportType: pick('reportType', ['lost', 'found']) ?? canvas.reportType
    };
  }, []);
}