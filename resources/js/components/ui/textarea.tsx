import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, invalid = false, ...props }, ref) => (
        <textarea
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(
                'min-h-28 w-full rounded-control border border-border bg-surface px-3.5 py-3 text-sm text-foreground transition-colors placeholder:text-foreground-subtle focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted',
                invalid &&
                    'border-danger focus:border-danger focus:ring-danger/15',
                className,
            )}
            {...props}
        />
    ),
);

Textarea.displayName = 'Textarea';
