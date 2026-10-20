import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    PackageIcon,
    PlusIcon,
    TagIcon,
    WatchIcon,
} from '@/components/icons';
import { StatusBadge } from '@/components/status-badge';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { ShipmentSummary } from '@/types/models';

type Stats = {
    watches_total: number;
    watches_published: number;
    shipments_total: number;
    shipments_active: number;
    delivered_this_month: number;
    active_promotions: number;
};

export default function AdminDashboard({
    stats,
    recent_shipments,
}: {
    stats: Stats;
    recent_shipments: ShipmentSummary[];
}) {
    const { t } = useTranslation();

    const cards = [
        {
            label: t('admin.dashboard.stats.watches'),
            value: stats.watches_total,
            hint: `${formatNumber(stats.watches_published)} ${t('admin.dashboard.stats.published').toLowerCase()}`,
            href: '/admin/watches',
            icon: WatchIcon,
        },
        {
            label: t('admin.dashboard.stats.shipments'),
            value: stats.shipments_total,
            hint: `${formatNumber(stats.shipments_active)} ${t('admin.dashboard.stats.active').toLowerCase()}`,
            href: '/admin/shipments',
            icon: PackageIcon,
        },
        {
            label: t('admin.dashboard.stats.delivered'),
            value: stats.delivered_this_month,
            hint: t('admin.dashboard.subtitle'),
            href: '/admin/shipments',
            icon: PackageIcon,
        },
        {
            label: t('admin.dashboard.stats.promotions'),
            value: stats.active_promotions,
            hint: t('admin.nav.promotions'),
            href: '/admin/promotions',
            icon: TagIcon,
        },
    ];

    return (
        <>
            <Head title={t('admin.dashboard.title')} />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-brand uppercase">
                        {t('admin.dashboard.eyebrow')}
                    </p>
                    <h1 className="mt-2 font-display text-4xl text-foreground">
                        {t('admin.dashboard.title')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {t('admin.dashboard.subtitle')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/admin/watches/create"
                        className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                    >
                        <PlusIcon className="size-4" />
                        {t('admin.watches.create')}
                    </Link>
                    <Link
                        href="/admin/shipments/create"
                        className="inline-flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
                    >
                        <PackageIcon className="size-4" />
                        {t('admin.shipments.create')}
                    </Link>
                </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ label, value, hint, href, icon: Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        className="group rounded-card border border-border bg-surface p-5 transition-colors hover:border-brand/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="flex size-9 items-center justify-center rounded-control bg-surface-strong text-foreground-muted group-hover:bg-brand-soft group-hover:text-brand">
                                <Icon className="size-4" />
                            </span>
                            <ArrowRightIcon className="size-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                        </div>
                        <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                            {formatNumber(value)}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-foreground-muted">
                            {label}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-foreground-subtle">
                            {hint}
                        </p>
                    </Link>
                ))}
            </div>

            <Card className="mt-8 overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                    <h2 className="font-display text-2xl text-foreground">
                        {t('admin.dashboard.recent')}
                    </h2>
                    <Link
                        href="/admin/shipments"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                    >
                        {t('admin.dashboard.viewAll')}
                        <ArrowRightIcon className="size-3.5" />
                    </Link>
                </div>

                {recent_shipments.length > 0 ? (
                    <div className="divide-y divide-border">
                        {recent_shipments.map((shipment) => (
                            <Link
                                key={shipment.uuid}
                                href={`/admin/shipments/${shipment.uuid}`}
                                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground">
                                        {shipment.tracking_number}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-foreground-muted">
                                        {shipment.recipient_name} ·{' '}
                                        {shipment.destination_city}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-foreground-subtle">
                                        {shipment.last_status_at
                                            ? formatDateTime(
                                                  shipment.last_status_at,
                                              )
                                            : '-'}
                                    </span>
                                    <StatusBadge
                                        status={shipment.status.value}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="px-5 py-12 text-center text-sm text-foreground-muted">
                        {t('admin.dashboard.empty')}
                    </p>
                )}
            </Card>
        </>
    );
}
