import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
    as?: 'div' | 'article' | 'section';
};

export function Card({
    className,
    as: Component = 'div',
    ...props
}: CardProps) {
    return (
        <Component
            className={cn(
                'rounded-card border border-border bg-surface',
                className,
            )}
            {...props}
        />
    );
}
