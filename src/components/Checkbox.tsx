import React from 'react';
import { CheckIcon } from 'lucide-react';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

// Custom-drawn checkbox: identical in every browser and exports to Figma as real shapes
// (native checkboxes with accent-color don't survive the import).
export function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <span className={`relative inline-flex h-4 w-4 shrink-0 ${className}`}>
      <input
        type="checkbox"
        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/40 bg-white/10 transition-colors duration-150 checked:border-accent checked:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        {...props} />
      
      <CheckIcon
        className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-secondary opacity-0 peer-checked:opacity-100"
        strokeWidth={3.5}
        aria-hidden />
      
    </span>);

}