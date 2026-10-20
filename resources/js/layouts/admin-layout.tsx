import { useEffect, useState, type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FlashToast } from '@/components/flash-toast';
import {
    BuildingIcon,
    DashboardIcon,
    LogOutIcon,
    MenuIcon,
    PackageIcon,
    TagIcon,
    WatchIcon,
    XIcon,
} from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', labelKey: 'admin.nav.dashboard', icon: DashboardIcon },
    {
        href: '/admin/watches',
        labelKey: 'admin.nav.watches',
        icon: WatchIcon,
    },
    {
        href: '/admin/promotions',
        labelKey: 'admin.nav.promotions',
        icon: TagIcon,
    },
    {
        href: '/admin/providers',
        labelKey: 'admin.nav.providers',
        icon: BuildingIcon,
    },
    {
        href: '/admin/shipments',
        labelKey: 'admin.nav.shipments',
        icon: PackageIcon,
    },
];

function pageTitle(component: string, t: (key: string) => string): string {
    if (component === 'admin/dashboard') {
        return t('admin.nav.dashboard');
    }
    if (component.startsWith('admin/watches')) {
        return t('admin.nav.watches');
    }
    if (component.startsWith('admin/promotions')) {
        return t('admin.nav.promotions');
    }
    if (component.startsWith('admin/providers')) {
        return t('admin.nav.providers');
    }
    if (component.startsWith('admin/shipments')) {
        return t('admin.nav.shipments');
    }

    return t('admin.title');
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const page = usePage();
    const { t } = useTranslation();
    const [path] = page.url.split('?');

    const isActive = (href: string) =>
        href === '/admin' ? path === '/admin' : path.startsWith(href);

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-3 border-b border-border px-5">
                <span className="flex size-8 items-center justify-center rounded-control bg-brand font-display text-base font-semibold text-brand-foreground">
                    B
                </span>
                <div>
                    <p className="font-display text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
                        Biwrawatch
                    </p>
                    <p className="text-[10px] tracking-[0.18em] text-foreground-subtle uppercase">
                        {t('admin.title')}
                    </p>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
                {navItems.map(({ href, labelKey, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                            'flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors',
                            isActive(href)
                                ? 'bg-brand-soft text-brand'
                                : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                        {t(labelKey)}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-border p-3">
                <Link
                    href="/"
                    className="flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                    {t('admin.viewSite')}
                </Link>
                <Link
                    href="/admin/logout"
                    method="post"
                    as="button"
                    className="flex h-10 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-medium text-foreground-muted transition-colors hover:bg-danger-soft hover:text-danger"
                >
                    <LogOutIcon className="size-4" />
                    {t('admin.logout')}
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = page.props.auth.user;

    useEffect(() => {
        setMobileOpen(false);
    }, [page.url]);

    return (
        <div className="min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 hidden w-65 border-r border-border bg-surface lg:block">
                <SidebarContent />
            </aside>

            {mobileOpen ? (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-overlay"
                        aria-label={t('nav.closeMenu')}
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-65 border-r border-border bg-surface shadow-panel">
                        <SidebarContent
                            onNavigate={() => setMobileOpen(false)}
                        />
                    </aside>
                </div>
            ) : null}

            <div className="lg:pl-65">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label={t('nav.openMenu')}
                        >
                            <MenuIcon className="size-5" />
                        </Button>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                                {t('admin.title')}
                            </p>
                            <h1 className="text-sm font-semibold text-foreground">
                                {pageTitle(page.component, t)}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
                            <span className="flex size-8 items-center justify-center rounded-pill bg-brand-soft text-xs font-semibold text-brand">
                                {user?.name.slice(0, 1).toUpperCase() ?? 'A'}
                            </span>
                            <div className="leading-tight">
                                <p className="text-xs font-semibold text-foreground">
                                    {user?.name ?? t('admin.adminFallback')}
                                </p>
                                <p className="text-[10px] text-foreground-subtle">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        {mobileOpen ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileOpen(false)}
                                aria-label={t('nav.closeMenu')}
                            >
                                <XIcon className="size-5" />
                            </Button>
                        ) : null}
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                    {children}
                </main>
            </div>

            <FlashToast />
        </div>
    );
}
