import { useEffect, useState, type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FlashToast } from '@/components/flash-toast';
import { MenuIcon, WhatsappIcon, XIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type SiteProps = {
    name: string;
    whatsapp_url: string | null;
    email: string | null;
    instagram_url: string | null;
    address: string | null;
};

export default function PublicLayout({ children }: { children: ReactNode }) {
    const page = usePage();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const site = page.props.site as SiteProps | undefined;
    const auth = page.props.auth;
    const [path] = page.url.split('?');

    useEffect(() => {
        setMobileOpen(false);
    }, [page.url]);

    const navigation = [
        { href: '/watches', label: t('nav.collection') },
        { href: '/track', label: t('nav.tracking') },
        { href: '/credits', label: t('nav.credits') },
    ];

    const isActive = (href: string) =>
        href === '/' ? path === '/' : path.startsWith(href);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-control bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {t('nav.skip')}
            </a>

            <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
                <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-3"
                        aria-label={site?.name ?? 'Biwrawatch'}
                    >
                        <span className="flex size-9 items-center justify-center rounded-control bg-brand font-display text-lg font-semibold text-brand-foreground">
                            B
                        </span>
                        <span className="font-display text-lg font-semibold tracking-[0.14em] text-foreground uppercase">
                            Biwrawatch
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-7 md:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative py-2 text-sm font-medium transition-colors',
                                    isActive(item.href)
                                        ? 'text-brand'
                                        : 'text-foreground-muted hover:text-foreground',
                                )}
                            >
                                {item.label}
                                {isActive(item.href) ? (
                                    <span className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-brand" />
                                ) : null}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle className="hidden sm:inline-flex" />
                        {auth.user?.is_admin ? (
                            <Link
                                href="/admin"
                                className="hidden h-9 items-center rounded-control px-3 text-xs font-semibold text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:inline-flex"
                            >
                                {t('nav.admin')}
                            </Link>
                        ) : null}
                        {site?.whatsapp_url ? (
                            <a
                                href={site.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex"
                            >
                                <Button size="sm">
                                    <WhatsappIcon className="size-4" />
                                    {t('nav.whatsapp')}
                                </Button>
                            </a>
                        ) : null}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-navigation"
                            aria-label={
                                mobileOpen
                                    ? t('nav.closeMenu')
                                    : t('nav.openMenu')
                            }
                        >
                            {mobileOpen ? (
                                <XIcon className="size-5" />
                            ) : (
                                <MenuIcon className="size-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {mobileOpen ? (
                    <div
                        id="mobile-navigation"
                        className="border-t border-border bg-surface md:hidden"
                    >
                        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'rounded-control px-3 py-3 text-sm font-medium',
                                        isActive(item.href)
                                            ? 'bg-brand-soft text-brand'
                                            : 'text-foreground-muted hover:bg-surface-muted',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                                <ThemeToggle />
                                {site?.whatsapp_url ? (
                                    <a
                                        href={site.whatsapp_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button size="sm">
                                            <WhatsappIcon className="size-4" />
                                            WhatsApp
                                        </Button>
                                    </a>
                                ) : null}
                            </div>
                        </nav>
                    </div>
                ) : null}
            </header>

            <main id="main-content" className="flex-1">
                {children}
            </main>

            <footer className="border-t border-border bg-surface">
                <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                        <p className="font-display text-2xl text-foreground">
                            Biwrawatch
                        </p>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground-muted">
                            {t('footer.tagline')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.14em] text-foreground-subtle uppercase">
                            {t('footer.explore')}
                        </p>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-foreground-muted transition-colors hover:text-brand"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.14em] text-foreground-subtle uppercase">
                            {t('footer.contact')}
                        </p>
                        <div className="mt-4 flex flex-col gap-2.5 text-sm text-foreground-muted">
                            {site?.email ? (
                                <a
                                    href={`mailto:${site.email}`}
                                    className="transition-colors hover:text-brand"
                                >
                                    {site.email}
                                </a>
                            ) : null}
                            {site?.instagram_url ? (
                                <a
                                    href={site.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-brand"
                                >
                                    Instagram
                                </a>
                            ) : null}
                            {site?.whatsapp_url ? (
                                <a
                                    href={site.whatsapp_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-brand"
                                >
                                    WhatsApp
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="border-t border-border">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Biwrawatch.{' '}
                            {t('footer.rights')}
                        </p>
                        <p>
                            {t('footer.credits')}{' '}
                            <Link
                                href="/credits"
                                className="text-foreground-muted underline-offset-4 hover:text-brand hover:underline"
                            >
                                Unsplash & Storyset
                            </Link>
                        </p>
                    </div>
                </div>
            </footer>

            <FlashToast />
        </div>
    );
}
