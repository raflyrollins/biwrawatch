import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
    title: string;
    description?: string;
    illustration?: string;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({
    title,
    description,
    illustration,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-panel border border-dashed border-border bg-surface-muted/50 px-6 py-16 text-center',
                className,
            )}
        >
            {illustration ? (
                <img
                    src={illustration}
                    alt=""
                    className="mb-6 h-44 w-auto max-w-full"
                    loading="lazy"
                />
            ) : null}
            <h2 className="font-display text-2xl text-foreground">{title}</h2>
            {description ? (
                <p className="mt-2 max-w-md text-sm text-foreground-muted">
                    {description}
                </p>
            ) : null}
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
