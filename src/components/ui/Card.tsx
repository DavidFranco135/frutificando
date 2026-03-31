import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'bordered';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white shadow-card hover:shadow-card-hover border border-black/5',
      flat: 'bg-cream border border-brand-700/10',
      bordered: 'bg-white border-2 border-brand-700/20',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl transition-shadow duration-300',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
export { Card };
