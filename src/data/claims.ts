import type { Claim, Match } from '../types/item';

export const claims: Claim[] = [
{ id: 'CL-311', itemId: 'IT-1045', claimant: 'Rey Castro', claimantRole: 'Student · BSIT 3A', submitted: '2026-11-05T09:12:00', claimantDetails: 'Contains my student ID (2023-01482), a GCash card and about ₱450 cash. Initials "RC" are embossed inside the fold.', finderNotes: 'Student ID inside reads Castro, R. 2023-01482. Cash present, not counted.', status: 'pending' },
{ id: 'CL-310', itemId: 'IT-1047', claimant: 'Nica Hinay', claimantRole: 'Student · BSIT 3A', submitted: '2026-11-05T08:40:00', claimantDetails: 'Lock screen photo of a golden retriever. Blue silicone case with a DNSC seal sticker. Top-left corner is cracked.', finderNotes: 'Lock screen shows a dog. Blue case with a round sticker. Cracked corner.', status: 'pending' },
{ id: 'CL-309', itemId: 'IT-1040', claimant: 'Aeron Alag', claimantRole: 'Student · BSIT 3A', submitted: '2026-11-04T15:22:00', claimantDetails: 'Case is engraved "AA" on the back. Right earbud has a small scratch near the stem.', finderNotes: 'Case has two engraved letters. Earbuds inside.', status: 'pending' },
{ id: 'CL-305', itemId: 'IT-1042', claimant: 'Jose Santos', claimantRole: 'Faculty · Institute of Computing', submitted: '2026-11-02T13:05:00', claimantDetails: 'Silver Casio with a steel band, the clasp is slightly loose.', finderNotes: 'Silver Casio, steel band.', status: 'approved' }];


export const matches: Match[] = [
{ id: 'M-01', lostId: 'IT-1048', foundId: 'IT-1047', score: 92, reasons: ['Same category', 'Same location', 'Same day', 'Blue case'] },
{ id: 'M-02', lostId: 'IT-1046', foundId: 'IT-1045', score: 88, reasons: ['Same category', 'Same location', 'Same day', 'Student ID inside'] },
{ id: 'M-03', lostId: 'IT-1041', foundId: 'IT-1040', score: 81, reasons: ['Same category', 'Same building', '1 day apart', 'Engraving'] }];