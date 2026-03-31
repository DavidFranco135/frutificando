import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'gray' | 'red' | 'yellow';
}

export function Badge({ className, variant = 'gray', ...props }: BadgeProps) {
  const variants = {
    green: 'bg-accent/10 text-accent-dark',
    gray: 'bg-brand-700/10 text-brand-700',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
