import { format, parseISO } from 'date-fns';
import { BackpackIcon, BookOpenIcon, KeyRoundIcon, SmartphoneIcon, WalletIcon, WatchIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '../types/item';

const iconMap: Record<Category, LucideIcon> = {
  Electronics: SmartphoneIcon,
  'Wallets & IDs': WalletIcon,
  Keys: KeyRoundIcon,
  Bags: BackpackIcon,
  Accessories: WatchIcon,
  'Books & Supplies': BookOpenIcon
};

export function categoryIcon(category: Category): LucideIcon {
  return iconMap[category];
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d · h:mm a');
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}