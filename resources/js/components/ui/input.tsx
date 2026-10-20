import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, invalid = false, ...props }, ref) => (
        <input
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(
                'h-11 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-foreground transition-colors placeholder:text-foreground-subtle focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted',
                invalid &&
                    'border-danger focus:border-danger focus:ring-danger/15',
                className,
            )}
            {...props}
        />
    ),
);

Input.displayName = 'Input';
