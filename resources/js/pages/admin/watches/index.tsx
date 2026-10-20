import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    PencilIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
    WatchIcon,
} from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { Price } from '@/components/price';
import { useTranslation } from '@/lib/i18n';
import { formatDate } from '@/lib/format';
import type { Paginator, WatchAdminSummary } from '@/types/models';

type Filters = {
    q?: string | null;
    status?: string | null;
    published?: string | null;
};

export default function AdminWatchesIndex({
    watches,
    filters,
    statuses,
}: {
    watches: Paginator<WatchAdminSummary>;
    filters: Filters;
    statuses: Record<string, string>;
}) {
    const { t } = useTranslation();
    const [pendingDelete, setPendingDelete] =
        useState<WatchAdminSummary | null>(null);
    const [processing, setProcessing] = useState(false);

    const destroy = () => {
        if (!pendingDelete) {
            return;
        }

        router.delete(`/admin/watches/${pendingDelete.uuid}`, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    };

    return (
        <>
            <Head title={t('admin.watches.title')} />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="font-display text-4xl text-foreground">
                        {t('admin.watches.title')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {t('admin.watches.subtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/watches/create"
                    className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                >
                    <PlusIcon className="size-4" />
                    {t('admin.watches.create')}
                </Link>
            </div>

            <Card className="mt-6 p-4">
                <form
                    action="/admin/watches"
                    method="get"
                    className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]"
                >
                    <div className="relative">
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-subtle" />
                        <Input
                            id="q"
                            name="q"
                            defaultValue={filters.q ?? ''}
                            placeholder={t('admin.watches.search')}
                            aria-label={t('admin.watches.search')}
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

                    <Select
                        name="published"
                        defaultValue={filters.published ?? ''}
                        aria-label={t('admin.watches.published')}
                    >
                        <option value="">{t('admin.common.all')}</option>
                        <option value="1">{t('admin.common.yes')}</option>
                        <option value="0">{t('admin.common.no')}</option>
                    </Select>

                    <Button type="submit">
                        <SearchIcon className="size-4" />
                        {t('admin.actions.search')}
                    </Button>
                </form>
            </Card>

            {watches.data.length > 0 ? (
                <>
                    <Card className="mt-4 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-border bg-surface-muted text-[10px] tracking-[0.14em] text-foreground-subtle uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.watch')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('watch.labels.status')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('watch.labels.price')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.watches.published')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.createdAt')}
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            {t('admin.common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {watches.data.map((watch) => (
                                        <tr
                                            key={watch.uuid}
                                            className="transition-colors hover:bg-surface-muted/60"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-11 shrink-0 overflow-hidden rounded-control bg-surface-muted">
                                                        {watch.image ? (
                                                            <img
                                                                src={
                                                                    watch.image
                                                                        .url
                                                                }
                                                                alt=""
                                                                className="size-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <span className="flex size-full items-center justify-center text-foreground-subtle">
                                                                <WatchIcon className="size-5" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            {watch.brand}{' '}
                                                            {watch.model}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted">
                                                            {
                                                                watch.reference_number
                                                            }
                                                            {watch.year
                                                                ? ` · ${watch.year}`
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    variant={
                                                        watch.status.value ===
                                                        'available'
                                                            ? 'success'
                                                            : watch.status
                                                                    .value ===
                                                                'reserved'
                                                              ? 'warning'
                                                              : 'neutral'
                                                    }
                                                >
                                                    {watch.status.label}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3">
                                                <Price
                                                    price={watch.price}
                                                    finalPrice={
                                                        watch.pricing
                                                            .final_price
                                                    }
                                                    discountAmount={
                                                        watch.pricing
                                                            .discount_amount
                                                    }
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    variant={
                                                        watch.is_published
                                                            ? 'success'
                                                            : 'outline'
                                                    }
                                                >
                                                    {watch.is_published
                                                        ? t('admin.common.yes')
                                                        : t('admin.common.no')}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3 text-xs text-foreground-muted">
                                                {formatDate(watch.created_at)}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={`/admin/watches/${watch.uuid}/edit`}
                                                        className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                                                        aria-label={t(
                                                            'admin.actions.edit',
                                                        )}
                                                    >
                                                        <PencilIcon className="size-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setPendingDelete(
                                                                watch,
                                                            )
                                                        }
                                                        className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-danger-soft hover:text-danger"
                                                        aria-label={t(
                                                            'admin.actions.delete',
                                                        )}
                                                    >
                                                        <TrashIcon className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Pagination
                        links={watches.links}
                        from={watches.from}
                        to={watches.to}
                        total={watches.total}
                        className="mt-6"
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-4"
                    illustration="/images/illustrations/no-data.svg"
                    title={t('admin.common.noData')}
                    description={t('admin.watches.empty')}
                    action={
                        <Link
                            href="/admin/watches/create"
                            className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground"
                        >
                            <PlusIcon className="size-4" />
                            {t('admin.watches.create')}
                        </Link>
                    }
                />
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onClose={() => setPendingDelete(null)}
                onConfirm={destroy}
                title={t('admin.actions.delete')}
                description={t('admin.watches.confirmDelete')}
                confirmLabel={t('admin.actions.confirm')}
                cancelLabel={t('admin.actions.cancel')}
                destructive
                processing={processing}
            />
        </>
    );
}
