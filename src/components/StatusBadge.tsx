import React from "react";
import { CheckIcon, CircleDotIcon, ClockIcon, HistoryIcon, LinkIcon, BoxIcon } from "lucide-react";
import { ItemStatus, ItemType } from "../types/item";
const statusStyles: Record<ItemStatus, {
  cls: string;
  icon: BoxIcon;
  label: string;
}> = {
  reported: {
    cls: 'bg-accent-soft text-primary',
    icon: CircleDotIcon,
    label: 'Reported'
  },
  matched: {
    cls: 'bg-success-light text-success',
    icon: LinkIcon,
    label: 'Matched'
  },
  claimed: {
    cls: 'bg-warning-light text-warning',
    icon: ClockIcon,
    label: 'For claim'
  },
  returned: {
    cls: 'bg-success-light text-success',
    icon: CheckIcon,
    label: 'Returned'
  },
  unresolved: {
    cls: 'bg-white/80 text-secondary',
    icon: HistoryIcon,
    label: 'Unresolved'
  }
};
export function StatusBadge({
  status


}: {status: ItemStatus;}) {
  const {
    cls,
    icon: Icon,
    label
  } = statusStyles[status];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>;
}
export function TypeBadge({
  type


}: {type: ItemType;}) {
  return <span className={`inline-flex min-w-[52px] justify-center whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${type === 'lost' ? 'bg-accent-light text-secondary' : 'bg-periwinkle-light text-periwinkle'}`}>
      {type}
    </span>;
}