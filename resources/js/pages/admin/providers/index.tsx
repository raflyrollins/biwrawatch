import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    BuildingIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useTranslation } from '@/lib/i18n';
import type { Paginator, ProviderSummary } from '@/types/models';

export default function ProvidersIndex({
    providers,
}: {
    providers: Paginator<ProviderSummary>;
}) {
    const { t } = useTranslation();
    const [pendingDelete, setPendingDelete] = useState<ProviderSummary | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const destroy = () => {
        if (!pendingDelete) {
            return;
        }

        router.delete(`/admin/providers/${pendingDelete.uuid}`, {
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
            <Head title={t('admin.providers.title')} />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="font-display text-4xl text-foreground">
                        {t('admin.providers.title')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {t('admin.providers.subtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/providers/create"
                    className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                >
                    <PlusIcon className="size-4" />
                    {t('admin.providers.create')}
                </Link>
            </div>

            {providers.data.length > 0 ? (
                <>
                    <Card className="mt-6 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-border bg-surface-muted text-[10px] tracking-[0.14em] text-foreground-subtle uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.providers.title')}
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            URL tracking
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            Pola
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            {t('admin.providers.trackings')}
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
                                    {providers.data.map((provider) => (
                                        <tr
                                            key={provider.uuid}
                                            className="transition-colors hover:bg-surface-muted/60"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-control bg-surface-strong text-foreground-muted">
                                                        <BuildingIcon className="size-4" />
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {provider.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td
                                                className="max-w-[260px] truncate px-5 py-3 text-xs text-foreground-muted"
                                                title={
                                                    provider.tracking_url_template
                                                }
                                            >
                                                {provider.tracking_url_template}
                                            </td>
                                            <td className="px-5 py-3 font-mono text-xs text-foreground-muted">
                                                {provider.tracking_number_pattern ??
                                                    '-'}
                                            </td>
                                            <td className="px-5 py-3 text-foreground-muted">
                                                {provider.trackings_count}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    variant={
                                                        provider.is_active
                                                            ? 'success'
                                                            : 'outline'
                                                    }
                                                >
                                                    {provider.is_active
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
                                                        href={`/admin/providers/${provider.uuid}/edit`}
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
                                                                provider,
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
                        links={providers.links}
                        from={providers.from}
                        to={providers.to}
                        total={providers.total}
                        className="mt-6"
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    illustration="/images/illustrations/no-data.svg"
                    title={t('admin.common.noData')}
                    description={t('admin.providers.empty')}
                    action={
                        <Link
                            href="/admin/providers/create"
                            className="inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground"
                        >
                            <PlusIcon className="size-4" />
                            {t('admin.providers.create')}
                        </Link>
                    }
                />
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onClose={() => setPendingDelete(null)}
                onConfirm={destroy}
                title={t('admin.actions.delete')}
                description={t('admin.providers.confirmDelete')}
                confirmLabel={t('admin.actions.confirm')}
                cancelLabel={t('admin.actions.cancel')}
                destructive
                processing={processing}
            />
        </>
    );
}
