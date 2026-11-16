export type Role = 'user' | 'admin';

export interface Session {
  role: Role;
  name: string;
  subtitle: string;
  initials: string;
}

export interface DemoAccount {
  name: string;
  subtitle: string;
  initials: string;
  tabLabel: string;
  title: string;
  blurb: string;
  idLabel: string;
  placeholder: string;
  demoId: string;
  demoPassword: string;
}

export interface NewAccount {
  name: string;
  subtitle: string;
}

export type UserStatus = 'active' | 'suspended';

export interface CampusUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Staff';
  program: string;
  reports: number;
  claims: number;
  joined: string;
  status: UserStatus;
}