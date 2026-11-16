import type { Role } from '../types/auth';

export const notifications: Record<Role, {id: number;text: string;time: string;}[]> = {
  admin: [
  { id: 1, text: 'Possible match found for "iPhone 13 with blue case"', time: '12 min ago' },
  { id: 2, text: 'New claim on "Brown wallet with student ID"', time: '1 hr ago' },
  { id: 3, text: '"Silver wristwatch" was returned to its owner', time: 'Yesterday' }],

  user: [
  { id: 1, text: 'Your claim for "Blue smartphone" is being verified', time: '40 min ago' },
  { id: 2, text: 'A possible match was found for "iPhone 13 with blue case"', time: '1 hr ago' }]

};