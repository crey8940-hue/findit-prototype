import type { DemoAccount, Role } from '../types/auth';

export const demoAccounts: Record<Role, DemoAccount> = {
  user: {
    name: 'Nica Hinay',
    subtitle: 'Student · BSIT 3A',
    initials: 'NH',
    tabLabel: 'User',
    title: 'Sign in to your account',
    blurb: 'Report lost items, track matches and claim what is yours.',
    idLabel: 'Student ID or email',
    placeholder: '2023-01219',
    demoId: '2023-01219',
    demoPassword: 'findit2026'
  },
  admin: {
    name: 'M. Alvarez',
    subtitle: 'Security Officer',
    initials: 'MA',
    tabLabel: 'Admin',
    title: 'Security Office sign in',
    blurb: 'Review matches, verify claims and release items.',
    idLabel: 'Staff email',
    placeholder: 'name@dnsc.edu.ph',
    demoId: 'm.alvarez@dnsc.edu.ph',
    demoPassword: 'admin2026'
  }
};

export const programs = ['BSIT', 'BSIS', 'BSEd', 'BEEd', 'BSHM', 'BSFi', 'BSAB'];

export const yearLevels = ['1st year', '2nd year', '3rd year', '4th year'];

export const signupBenefits = [
{ title: 'Get match alerts', text: 'We notify you the moment a similar found item is logged on campus.' },
{ title: 'Claim securely', text: 'Prove ownership with details only you know — the Security Office verifies before release.' },
{ title: 'Track every report', text: 'See where your lost and found reports stand, from reported to returned.' }];