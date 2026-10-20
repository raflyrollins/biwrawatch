import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    PackageIcon,
    PlusIcon,
    SearchIcon,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { useTranslation } from '@/lib/i18n';
import { formatDateTime } from '@/lib/format';
import type { Paginator, ShipmentSummary } from '@/types/models';

type Filters = {
    q?: string | null;
    status?: string | null;
};

export default function ShipmentsIndex({
    shipments,
    filters,
    statuses,
}: {
    shipments: Paginator<ShipmentSummary>;
    filters: Filters;
    statuses: Record<string, string>;
}) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.shipments.title')} />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="font-display text-4xl text-foreground">
                        {t('admin.shipments.title')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {t('admin.shipments.subtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/shipments/create"
                    className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                >
                    <PlusIcon className="size-4" />
                    {t('admin.shipments.create')}
                </Link>
            </div>

            <Card className="mt-6 p-4">
                <form
                    action="/admin/shipments"
                    method="get"
                    className="grid gap-3 md:grid-cols-[1fr_220px_auto]"
                >
                    <div className="relative">
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-subtle" />
                        <Input
                            name="q"
                            defaultValue={filters.q ?? ''}
                            placeholder={t('admin.shipments.search')}
                            aria-label={t('admin.shipments.search')}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        name="status"
                        defaultValue={filters.status ?? ''}
                        aria-label={t('admin.common.status')}
                    >
                        <option value="">{t('admin.common.all')}</option>
                        {Object.entries(statuses).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </Select>
                    <Button type="submit">
                        <SearchIcon className="size-4" />
                        {t('admin.actions.search')}
                    </Button>
                </form>
            </Card>

            {shipments.data.length > 0 ? (
                <>
                    <Card className="mt-4 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left text-sm">
                                <thead className="border-b border-border bg-surface-muted text-[10px] tracking-[0.14em] text-foreground-subtle uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.trackingNumber')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.recipient')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.destination')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.status')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.shipments.lastUpdate')}
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            {t('admin.common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {shipments.data.map((shipment) => (
                                        <tr
                                            key={shipment.uuid}
                                            className="transition-colors hover:bg-surface-muted/60"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-control bg-brand-soft text-brand">
                                                        <PackageIcon className="size-4" />
                                                    </span>
                                                    <span className="font-mono text-sm font-semibold text-foreground">
                                                        {
                                                            shipment.tracking_number
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-foreground">
                                                {shipment.recipient_name}
                                            </td>
                                            <td className="px-5 py-3 text-foreground-muted">
                                                {shipment.destination_city}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge
                                                    status={
                                                        shipment.status.value
                                                    }
                                                />
                                            </td>
                                            <td className="px-5 py-3 text-xs text-foreground-muted">
                                                {shipment.last_status_at
                                                    ? formatDateTime(
                                                          shipment.last_status_at,
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Link
                                                    href={`/admin/shipments/${shipment.uuid}`}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-control px-3 text-xs font-semibold text-brand hover:bg-brand-soft"
                                                >
                                                    {t('admin.actions.view')}
                                                    <ArrowRightIcon className="size-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    <Pagination
                        links={shipments.links}
                        from={shipments.from}
                        to={shipments.to}
                        total={shipments.total}
                        className="mt-6"
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-4"
                    illustration="/images/illustrations/no-data.svg"
                    title={t('admin.common.noData')}
                    description={t('admin.shipments.empty')}
                    action={
                        <Link
                            href="/admin/shipments/create"
                            className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground"
                        >
                            <PlusIcon className="size-4" />
                            {t('admin.shipments.create')}
                        </Link>
                    }
                />
            )}
        </>
    );
}
