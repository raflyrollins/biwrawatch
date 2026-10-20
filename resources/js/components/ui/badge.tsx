import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
    | 'neutral'
    | 'brand'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline';

const variants: Record<BadgeVariant, string> = {
    neutral: 'bg-surface-strong text-foreground-muted',
    brand: 'bg-brand-soft text-brand',
    accent: 'bg-accent-soft text-accent',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
    outline: 'border border-border bg-transparent text-foreground-muted',
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
};

export function Badge({
    className,
    variant = 'neutral',
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex h-6 items-center rounded-pill px-2.5 text-[11px] font-semibold tracking-wide',
                variants[variant],
                className,
            )}
            {...props}
        />
    );
}
