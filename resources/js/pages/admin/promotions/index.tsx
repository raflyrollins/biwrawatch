import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    PencilIcon,
    PlusIcon,
    SearchIcon,
    TagIcon,
    TrashIcon,
} from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Paginator, PromotionSummary } from '@/types/models';

type Filters = {
    q?: string | null;
    active?: string | null;
};

export default function PromotionsIndex({
    promotions,
    filters,
}: {
    promotions: Paginator<PromotionSummary>;
    filters: Filters;
}) {
    const { t } = useTranslation();
    const [pendingDelete, setPendingDelete] = useState<PromotionSummary | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const destroy = () => {
        if (!pendingDelete) {
            return;
        }

        router.delete(`/admin/promotions/${pendingDelete.uuid}`, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    };

    const discount = (promotion: PromotionSummary): string => {
        if (
            promotion.discount_type === null ||
            promotion.discount_value === null
        ) {
            return t('admin.promotions.noDiscount');
        }

        return promotion.discount_type === 'percentage'
            ? `${promotion.discount_value}%`
            : formatCurrency(promotion.discount_value);
    };

    return (
        <>
            <Head title={t('admin.promotions.title')} />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="font-display text-4xl text-foreground">
                        {t('admin.promotions.title')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {t('admin.promotions.subtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/promotions/create"
                    className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                >
                    <PlusIcon className="size-4" />
                    {t('admin.promotions.create')}
                </Link>
            </div>

            <Card className="mt-6 p-4">
                <form
                    action="/admin/promotions"
                    method="get"
                    className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
                >
                    <div className="relative">
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-subtle" />
                        <Input
                            name="q"
                            defaultValue={filters.q ?? ''}
                            placeholder={t('admin.promotions.search')}
                            aria-label={t('admin.promotions.search')}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        name="active"
                        defaultValue={filters.active ?? ''}
                        aria-label={t('admin.common.status')}
                    >
                        <option value="">{t('admin.common.all')}</option>
                        <option value="1">{t('admin.common.active')}</option>
                        <option value="0">{t('admin.common.inactive')}</option>
                    </Select>
                    <Button type="submit">
                        <SearchIcon className="size-4" />
                        {t('admin.actions.search')}
                    </Button>
                </form>
            </Card>

            {promotions.data.length > 0 ? (
                <>
                    <Card className="mt-4 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left text-sm">
                                <thead className="border-b border-border bg-surface-muted text-[10px] tracking-[0.14em] text-foreground-subtle uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('promotion.labels.name')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t(
                                                'promotion.labels.discount_value',
                                            )}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t(
                                                'promotion.labels.watches_count',
                                            )}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('promotion.labels.ends_at')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.common.status')}
                                        </th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            {t('admin.common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {promotions.data.map((promotion) => (
                                        <tr
                                            key={promotion.uuid}
                                            className="transition-colors hover:bg-surface-muted/60"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-control bg-accent-soft text-accent">
                                                        <TagIcon className="size-4" />
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            {promotion.name}
                                                        </p>
                                                        <p className="text-xs text-foreground-muted">
                                                            {promotion.label ??
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-foreground">
                                                {discount(promotion)}
                                            </td>
                                            <td className="px-5 py-3 text-foreground-muted">
                                                {promotion.applies_to_all
                                                    ? t(
                                                          'admin.promotions.appliesAllHint',
                                                      )
                                                    : `${promotion.watches_count}`}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-foreground-muted">
                                                {promotion.ends_at
                                                    ? formatDate(
                                                          promotion.ends_at,
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    variant={
                                                        promotion.is_active
                                                            ? 'success'
                                                            : 'outline'
                                                    }
                                                >
                                                    {promotion.is_active
                                                        ? t(
                                                              'admin.common.active',
                                                          )
                                                        : t(
                                                              'admin.common.inactive',
                                                          )}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={`/admin/promotions/${promotion.uuid}/edit`}
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
                                                                promotion,
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
                        links={promotions.links}
                        from={promotions.from}
                        to={promotions.to}
                        total={promotions.total}
                        className="mt-6"
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-4"
                    illustration="/images/illustrations/no-data.svg"
                    title={t('admin.common.noData')}
                    description={t('admin.promotions.empty')}
                    action={
                        <Link
                            href="/admin/promotions/create"
                            className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground"
                        >
                            <PlusIcon className="size-4" />
                            {t('admin.promotions.create')}
                        </Link>
                    }
                />
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onClose={() => setPendingDelete(null)}
                onConfirm={destroy}
                title={t('admin.actions.delete')}
                description={t('admin.promotions.confirmDelete')}
                confirmLabel={t('admin.actions.confirm')}
                cancelLabel={t('admin.actions.cancel')}
                destructive
                processing={processing}
            />
        </>
    );
}
