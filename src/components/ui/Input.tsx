import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2"
          >
            {icon}
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-2xl bg-cream',
            'border border-transparent text-brand-700 placeholder:text-brand-700/30',
            'focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent',
            'transition-all duration-200',
            error && 'ring-2 ring-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2"
          >
            {icon}
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-2xl bg-cream resize-none',
            'border border-transparent text-brand-700 placeholder:text-brand-700/30',
            'focus:outline-none focus:ring-2 focus:ring-brand-700',
            'transition-all duration-200',
            error && 'ring-2 ring-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
