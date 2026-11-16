import type { CampusUser } from '../types/auth';

export const campusUsers: CampusUser[] = [
{ id: 'U-2023-01219', name: 'Nica Hinay', email: 'nica.hinay@dnsc.edu.ph', role: 'Student', program: 'BSIT 3A', reports: 1, claims: 1, joined: '2026-08-14', status: 'active' },
{ id: 'U-2023-01482', name: 'Rey Castro', email: 'rey.castro@dnsc.edu.ph', role: 'Student', program: 'BSIT 3A', reports: 1, claims: 1, joined: '2026-08-15', status: 'active' },
{ id: 'U-2023-01077', name: 'Aeron Alag', email: 'aeron.alag@dnsc.edu.ph', role: 'Student', program: 'BSIT 3A', reports: 1, claims: 1, joined: '2026-08-20', status: 'active' },
{ id: 'U-2022-00841', name: 'Mark Villanueva', email: 'mark.villanueva@dnsc.edu.ph', role: 'Student', program: 'BSIS 4B', reports: 1, claims: 0, joined: '2025-08-10', status: 'active' },
{ id: 'U-2024-00312', name: 'Joy Santos', email: 'joy.santos@dnsc.edu.ph', role: 'Student', program: 'BSEd 2A', reports: 1, claims: 0, joined: '2026-08-12', status: 'active' },
{ id: 'U-2021-00590', name: 'Paolo Reyes', email: 'paolo.reyes@dnsc.edu.ph', role: 'Student', program: 'BSHM 4A', reports: 1, claims: 0, joined: '2024-08-09', status: 'suspended' },
{ id: 'F-0142', name: 'Jose Santos', email: 'jose.santos@dnsc.edu.ph', role: 'Faculty', program: 'Institute of Computing', reports: 0, claims: 1, joined: '2023-06-01', status: 'active' },
{ id: 'S-0031', name: 'Coach Ramirez', email: 'ramirez@dnsc.edu.ph', role: 'Staff', program: 'Athletics Office', reports: 1, claims: 0, joined: '2022-06-01', status: 'active' },
{ id: 'S-0057', name: 'Ms. Dela Cruz', email: 'delacruz@dnsc.edu.ph', role: 'Staff', program: 'Cafeteria', reports: 1, claims: 0, joined: '2023-01-10', status: 'active' }];