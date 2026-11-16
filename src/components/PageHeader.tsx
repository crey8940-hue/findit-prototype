import React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import { format } from 'date-fns';

type PageHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  showDate?: boolean;
};

export function PageHeader({ title, subtitle, actions, showDate }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-[32px] md:leading-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-base text-white/75 md:text-lg">{subtitle}</p>}
      </div>
      {(actions || showDate) &&
      <div className="flex flex-wrap items-center gap-3">
          {actions}
          {showDate &&
        <span className="glass inline-flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium">
              <CalendarDaysIcon className="h-5 w-5 text-white/80" />
              {format(new Date(), 'EEE, MMM d, yyyy')}
            </span>
        }
        </div>
      }
    </div>);

}