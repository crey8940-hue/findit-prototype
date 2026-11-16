import type { Category, Item } from '../types/item';

export const categories: Category[] = [
'Electronics',
'Wallets & IDs',
'Keys',
'Bags',
'Accessories',
'Books & Supplies'];


export const locations = [
'Library',
'Cafeteria',
'Gymnasium',
'IC Building',
'Admin Building',
'Covered Court',
'Science Lab',
'Parking Area'];


export const items: Item[] = [
{ id: 'IT-1048', type: 'lost', name: 'iPhone 13 with blue case', category: 'Electronics', description: 'Blue silicone case with a DNSC seal sticker on the back. Lock screen shows a golden retriever.', location: 'Library', date: '2026-11-05', status: 'matched', reporter: 'Nica Hinay' },
{ id: 'IT-1047', type: 'found', name: 'Blue smartphone', category: 'Electronics', description: 'Found on a reading table, 2nd floor. Blue case with a sticker, slightly cracked corner.', location: 'Library', date: '2026-11-05', status: 'matched', reporter: 'Security Office' },
{ id: 'IT-1046', type: 'lost', name: 'Brown leather wallet', category: 'Wallets & IDs', description: 'Bifold wallet with initials "RC" embossed inside. Contains student ID and GCash card.', location: 'Cafeteria', date: '2026-11-04', status: 'matched', reporter: 'Rey Castro' },
{ id: 'IT-1045', type: 'found', name: 'Brown wallet with student ID', category: 'Wallets & IDs', description: 'Left on the counter near the drinks station. Turned over to security.', location: 'Cafeteria', date: '2026-11-04', status: 'claimed', reporter: 'Ms. Dela Cruz' },
{ id: 'IT-1044', type: 'found', name: 'Keys on a blue lanyard', category: 'Keys', description: 'Three keys and a small motorcycle key on a blue DNSC lanyard.', location: 'Covered Court', date: '2026-11-03', status: 'reported', reporter: 'Security Office' },
{ id: 'IT-1043', type: 'lost', name: 'Black Jansport backpack', category: 'Bags', description: 'Black backpack with a laptop sleeve and a keychain of a small turtle.', location: 'IC Building', date: '2026-11-03', status: 'unresolved', reporter: 'Mark Villanueva' },
{ id: 'IT-1042', type: 'found', name: 'Silver wristwatch', category: 'Accessories', description: 'Analog watch with a steel band, found near the bleachers.', location: 'Gymnasium', date: '2026-11-02', status: 'returned', reporter: 'Coach Ramirez' },
{ id: 'IT-1041', type: 'lost', name: 'White wireless earbuds', category: 'Electronics', description: 'Case engraved with "AA". Right earbud has a small scratch.', location: 'Science Lab', date: '2026-11-02', status: 'matched', reporter: 'Aeron Alag' },
{ id: 'IT-1040', type: 'found', name: 'White earbuds case', category: 'Electronics', description: 'Found in the hallway outside Lab 3. Case has engraved letters.', location: 'Science Lab', date: '2026-11-01', status: 'matched', reporter: 'Lab Assistant' },
{ id: 'IT-1039', type: 'lost', name: 'Calculus textbook', category: 'Books & Supplies', description: 'Stewart Calculus, 8th edition, name written on the inside cover.', location: 'Library', date: '2026-10-31', status: 'returned', reporter: 'Joy Santos' },
{ id: 'IT-1038', type: 'found', name: 'Student ID, BSIT 3rd year', category: 'Wallets & IDs', description: 'School ID in a clear holder, found at the registrar line.', location: 'Admin Building', date: '2026-10-30', status: 'returned', reporter: 'Registrar' },
{ id: 'IT-1037', type: 'lost', name: 'Navy folding umbrella', category: 'Accessories', description: 'Compact navy umbrella with a wooden handle.', location: 'Parking Area', date: '2026-10-29', status: 'unresolved', reporter: 'Paolo Reyes' }];