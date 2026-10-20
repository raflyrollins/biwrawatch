import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DialogProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
};

export function Dialog({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    className,
}: DialogProps) {
    const titleId = useId();
    const descriptionId = useId();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        window.setTimeout(() => closeButtonRef.current?.focus(), 0);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-0 sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                    'max-h-[90vh] w-full overflow-y-auto rounded-t-panel border border-border bg-surface p-6 shadow-panel sm:max-w-lg sm:rounded-panel',
                    className,
                )}
            >
                <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-1.5">
                        <h2
                            id={titleId}
                            className="font-display text-2xl text-foreground"
                        >
                            {title}
                        </h2>
                        {description ? (
                            <p
                                id={descriptionId}
                                className="text-sm text-foreground-muted"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <Button
                        ref={closeButtonRef}
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Tutup dialog"
                    >
                        <XIcon className="size-5" />
                    </Button>
                </div>
                {children ? <div className="mt-5">{children}</div> : null}
                {footer ? (
                    <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>,
        document.body,
    );
}

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    destructive?: boolean;
    processing?: boolean;
};

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Batal',
    destructive = false,
    processing = false,
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={title}
            description={description}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={destructive ? 'destructive' : 'primary'}
                        onClick={onConfirm}
                        isLoading={processing}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        />
    );
}
