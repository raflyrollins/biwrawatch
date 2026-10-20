import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { FlashToast } from '@/components/flash-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/lib/i18n';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslation();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
            <div className="absolute top-5 right-5">
                <ThemeToggle />
            </div>

            <div className="relative w-full max-w-md">
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
                    <span className="flex size-10 items-center justify-center rounded-control bg-brand font-display text-xl font-semibold text-brand-foreground">
                        B
                    </span>
                    <span className="font-display text-xl font-semibold tracking-[0.16em] text-foreground uppercase">
                        Biwrawatch
                    </span>
                </Link>

                <div className="rounded-panel border border-border bg-surface p-8 shadow-card">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-foreground-subtle">
                    {t('admin.loginFooter')}
                </p>
            </div>

            <FlashToast />
        </div>
    );
}
