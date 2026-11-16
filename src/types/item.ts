export type ItemType = 'lost' | 'found';
export type ItemStatus = 'reported' | 'matched' | 'claimed' | 'returned' | 'unresolved';
export type Category =
'Electronics' |
'Wallets & IDs' |
'Keys' |
'Bags' |
'Accessories' |
'Books & Supplies';

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  category: Category;
  description: string;
  location: string;
  date: string;
  status: ItemStatus;
  reporter: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  id: string;
  itemId: string;
  claimant: string;
  claimantRole: string;
  submitted: string;
  claimantDetails: string;
  finderNotes: string;
  status: ClaimStatus;
}

export interface Match {
  id: string;
  lostId: string;
  foundId: string;
  score: number;
  reasons: string[];
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  time: string;
}