import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, invalid = false, ...props }, ref) => (
        <div className="relative">
            <select
                ref={ref}
                aria-invalid={invalid || undefined}
                className={cn(
                    'h-11 w-full appearance-none rounded-control border border-border bg-surface pr-10 pl-3.5 text-sm text-foreground transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted',
                    invalid &&
                        'border-danger focus:border-danger focus:ring-danger/15',
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground-muted" />
        </div>
    ),
);

Select.displayName = 'Select';
