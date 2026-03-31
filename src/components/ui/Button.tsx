import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-md active:bg-brand-900',
      secondary: 'bg-cream text-brand-700 hover:bg-cream-dark shadow-sm',
      outline: 'border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white',
      ghost: 'text-brand-700 hover:bg-cream',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-2.5 text-sm gap-2',
      lg: 'px-8 py-4 text-base font-semibold gap-2',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          'transition-all duration-200 active:scale-[0.97]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Aguarde...</span>
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
