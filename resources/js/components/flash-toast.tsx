import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertIcon, CheckIcon, XIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

type Flash = {
    success?: string;
    error?: string;
};

export function FlashToast() {
    const page = usePage();
    const flash = page.props.flash as Flash | undefined;
    const [dismissed, setDismissed] = useState(false);

    const message = flash?.success ?? flash?.error;
    const isError = Boolean(flash?.error);

    useEffect(() => {
        setDismissed(false);

        if (!message) {
            return;
        }

        const timeout = window.setTimeout(() => setDismissed(true), 5000);

        return () => window.clearTimeout(timeout);
    }, [message]);

    if (!message || dismissed) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'fixed right-4 bottom-4 z-40 flex max-w-sm items-start gap-3 rounded-card border bg-surface p-4 shadow-panel',
                isError ? 'border-danger/30' : 'border-success/30',
            )}
        >
            <span
                className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill',
                    isError
                        ? 'bg-danger-soft text-danger'
                        : 'bg-success-soft text-success',
                )}
            >
                {isError ? (
                    <AlertIcon className="size-3.5" />
                ) : (
                    <CheckIcon className="size-3.5" />
                )}
            </span>
            <p className="flex-1 text-sm text-foreground">{message}</p>
            <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-foreground-subtle hover:text-foreground"
                aria-label="Tutup notifikasi"
            >
                <XIcon className="size-4" />
            </button>
        </div>
    );
}
