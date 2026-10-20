import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FieldProps = {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    required?: boolean;
    className?: string;
    children: ReactNode;
};

export function Field({
    label,
    htmlFor,
    error,
    hint,
    required = false,
    className,
    children,
}: FieldProps) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <label
                htmlFor={htmlFor}
                className="text-sm font-semibold text-foreground"
            >
                {label}
                {required ? (
                    <span className="ml-1 text-brand" aria-hidden="true">
                        *
                    </span>
                ) : null}
            </label>
            {children}
            {error ? (
                <p id={`${htmlFor}-error`} className="text-xs text-danger">
                    {error}
                </p>
            ) : hint ? (
                <p
                    id={`${htmlFor}-hint`}
                    className="text-xs text-foreground-muted"
                >
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
