import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { RefreshIcon } from '@/components/icons';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-brand text-brand-foreground hover:bg-brand-hover disabled:bg-brand/60',
    secondary:
        'border border-border bg-surface text-foreground hover:bg-surface-muted disabled:text-foreground-subtle',
    ghost: 'text-foreground-muted hover:bg-surface-muted hover:text-foreground disabled:text-foreground-subtle',
    destructive:
        'bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60',
    link: 'h-auto rounded-none p-0 text-brand underline-offset-4 hover:underline',
};

const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-sm',
    icon: 'size-11 p-0',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            children,
            type = 'button',
            ...props
        },
        ref,
    ) => (
        <button
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            className={cn(
                'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-150 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {isLoading ? <RefreshIcon className="size-4 animate-spin" /> : null}
            {children}
        </button>
    ),
);

Button.displayName = 'Button';
