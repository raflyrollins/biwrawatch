import { useState, type ReactNode } from 'react';
import { Head, Link, router, useForm, WhenMounted } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    CheckIcon,
    ClockIcon,
    CopyIcon,
    ExternalLinkIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    ShieldCheckIcon,
    TruckIcon,
    UserIcon,
} from '@/components/icons';
import { ShipmentTimeline } from '@/components/shipment-timeline';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n';
import { formatDateTime } from '@/lib/format';
import type {
    ProviderOption,
    ShipmentDetail,
    ShipmentEvent,
    ShipmentTracking,
} from '@/types/models';

export default function ShipmentShow({
    shipment,
    providers,
    statuses,
    public_url,
}: {
    shipment: ShipmentDetail;
    providers: ProviderOption[];
    statuses: Record<string, string>;
    public_url: string;
}) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [pendingTracking, setPendingTracking] =
        useState<ShipmentTracking | null>(null);
    const [pendingEvent, setPendingEvent] = useState<ShipmentEvent | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const statusForm = useForm({
        status: shipment.status.value,
        location: '',
        note: '',
        is_public: true,
        occurred_at: '',
    });

    const trackingForm = useForm({
        provider_id: providers[0]?.id.toString() ?? '',
        tracking_number: '',
        is_primary: shipment.trackings.length === 0,
        notes: '',
    });

    const copyLink = async () => {
        await navigator.clipboard.writeText(public_url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const removeTracking = () => {
        if (!pendingTracking) {
            return;
        }

        router.delete(
            `/admin/shipments/${shipment.uuid}/trackings/${pendingTracking.id}`,
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    setProcessing(false);
                    setPendingTracking(null);
                },
            },
        );
    };

    const removeEvent = () => {
        if (!pendingEvent) {
            return;
        }

        router.delete(
            `/admin/shipments/${shipment.uuid}/events/${pendingEvent.id}`,
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    setProcessing(false);
                    setPendingEvent(null);
                },
            },
        );
    };

    return (
        <>
            <Head title={t('admin.shipments.detailTitle')} />

            <WhenMounted>
                <ShipmentRealtime uuid={shipment.uuid} />
            </WhenMounted>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-sm font-semibold text-foreground">
                            {shipment.tracking_number}
                        </p>
                        <StatusBadge status={shipment.status.value} />
                    </div>
                    <h1 className="mt-2 font-display text-4xl text-foreground">
                        {t('admin.shipments.detailTitle')}
                    </h1>
                    <p className="mt-2 text-sm text-foreground-muted">
                        {shipment.recipient_name} · {shipment.destination_city},{' '}
                        {shipment.destination_country}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/admin/shipments/${shipment.uuid}/edit`}
                        className="inline-flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
                    >
                        <PencilIcon className="size-4" />
                        {t('admin.actions.edit')}
                    </Link>
                    <Link
                        href="/admin/shipments"
                        className="inline-flex h-10 items-center rounded-control px-4 text-sm font-semibold text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    >
                        {t('admin.actions.back')}
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_380px]">
                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('admin.shipments.shipmentInfo')}
                        </h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-2">
                            <Info
                                icon={UserIcon}
                                label={t('shipment.labels.recipient_name')}
                                value={shipment.recipient_name}
                            />
                            <Info
                                icon={ShieldCheckIcon}
                                label={t('shipment.labels.recipient_phone')}
                                value={shipment.recipient_phone}
                            />
                            <Info
                                icon={MapPinIcon}
                                label={t('shipment.labels.recipient_address')}
                                value={shipment.recipient_address}
                            />
                            <Info
                                icon={ClockIcon}
                                label={t(
                                    'shipment.labels.estimated_delivery_at',
                                )}
                                value={
                                    shipment.estimated_delivery_at
                                        ? formatDateTime(
                                              shipment.estimated_delivery_at,
                                          )
                                        : '-'
                                }
                            />
                        </div>
                        {shipment.internal_notes ? (
                            <div className="mt-5 border-t border-border pt-4">
                                <p className="text-[10px] font-semibold tracking-[0.14em] text-foreground-subtle uppercase">
                                    {t('shipment.labels.internal_notes')}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-foreground-muted">
                                    {shipment.internal_notes}
                                </p>
                            </div>
                        ) : null}
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                                {t('admin.shipments.trackingHistory')}
                            </h2>
                            <TruckIcon className="size-4 text-brand" />
                        </div>

                        <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                            {shipment.trackings.length > 0 ? (
                                shipment.trackings.map((tracking) => (
                                    <div
                                        key={tracking.id}
                                        className="rounded-card border border-border p-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {tracking.provider_name}
                                                </p>
                                                <p className="mt-0.5 font-mono text-xs text-foreground-muted">
                                                    {tracking.tracking_number}
                                                </p>
                                            </div>
                                            {tracking.is_primary ? (
                                                <span className="rounded-pill bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                                                    {t('ui.trackPage.primary')}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {!tracking.is_primary ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            `/admin/shipments/${shipment.uuid}/trackings/${tracking.id}/primary`,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        'admin.actions.setPrimary',
                                                    )}
                                                </Button>
                                            ) : null}
                                            {tracking.tracking_url ? (
                                                <a
                                                    href={tracking.tracking_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-9 items-center gap-1 rounded-control px-3 text-xs font-semibold text-brand hover:bg-brand-soft"
                                                >
                                                    {t(
                                                        'ui.trackPage.openCourier',
                                                    )}
                                                    <ExternalLinkIcon className="size-3" />
                                                </a>
                                            ) : null}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setPendingTracking(tracking)
                                                }
                                                className="text-danger hover:text-danger"
                                            >
                                                {t('admin.actions.delete')}
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-foreground-muted">
                                    {t('admin.shipments.noTrackings')}
                                </p>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('admin.shipments.publicLink')}
                        </h2>
                        <div className="mt-3 flex gap-2">
                            <Input
                                value={public_url}
                                readOnly
                                className="text-xs"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                onClick={copyLink}
                                aria-label={t('admin.actions.copy')}
                            >
                                {copied ? (
                                    <CheckIcon className="size-4 text-success" />
                                ) : (
                                    <CopyIcon className="size-4" />
                                )}
                            </Button>
                        </div>
                        <a
                            href={public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                        >
                            {t('admin.shipments.publicTracking')}
                            <ExternalLinkIcon className="size-3.5" />
                        </a>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('admin.shipments.addStatus')}
                        </h2>
                        <div className="mt-4 max-h-[32rem] overflow-y-auto pr-2">
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    statusForm.patch(
                                        `/admin/shipments/${shipment.uuid}/status`,
                                        {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                statusForm.reset(
                                                    'location',
                                                    'note',
                                                    'occurred_at',
                                                ),
                                        },
                                    );
                                }}
                            >
                                <Field
                                    label={t('shipment.labels.status')}
                                    htmlFor="status"
                                    required
                                    error={statusForm.errors.status}
                                >
                                    <Select
                                        id="status"
                                        value={statusForm.data.status}
                                        onChange={(event) =>
                                            statusForm.setData(
                                                'status',
                                                event.target.value,
                                            )
                                        }
                                    >
                                        {Object.entries(statuses).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </Select>
                                </Field>
                                <Field
                                    label={t('shipment.labels.location')}
                                    htmlFor="location"
                                    error={statusForm.errors.location}
                                >
                                    <Input
                                        id="location"
                                        value={statusForm.data.location}
                                        onChange={(event) =>
                                            statusForm.setData(
                                                'location',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'admin.shipments.locationPlaceholder',
                                        )}
                                    />
                                </Field>
                                <Field
                                    label={t('shipment.labels.note')}
                                    htmlFor="note"
                                    error={statusForm.errors.note}
                                >
                                    <Textarea
                                        id="note"
                                        value={statusForm.data.note}
                                        onChange={(event) =>
                                            statusForm.setData(
                                                'note',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'admin.shipments.notePlaceholder',
                                        )}
                                        rows={3}
                                    />
                                </Field>
                                <Field
                                    label={t('shipment.labels.occurred_at')}
                                    htmlFor="occurred_at"
                                    error={statusForm.errors.occurred_at}
                                >
                                    <CalendarWidget
                                        id="occurred_at"
                                        mode="datetime"
                                        value={statusForm.data.occurred_at}
                                        onChange={(value) =>
                                            statusForm.setData(
                                                'occurred_at',
                                                value,
                                            )
                                        }
                                        invalid={Boolean(
                                            statusForm.errors.occurred_at,
                                        )}
                                    />
                                </Field>
                                <label className="flex items-center justify-between gap-3 text-sm text-foreground">
                                    {t('shipment.labels.is_public')}
                                    <input
                                        type="checkbox"
                                        checked={statusForm.data.is_public}
                                        onChange={(event) =>
                                            statusForm.setData(
                                                'is_public',
                                                event.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-border text-brand focus:ring-brand"
                                    />
                                </label>
                                <Button
                                    type="submit"
                                    isLoading={statusForm.processing}
                                    className="w-full"
                                >
                                    {t('admin.actions.save')}
                                </Button>
                                <p className="text-xs leading-relaxed text-foreground-subtle">
                                    {t('admin.shipments.statusHint')}
                                </p>
                            </form>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                                {t('admin.shipments.addTracking')}
                            </h2>
                            <TruckIcon className="size-4 text-brand" />
                        </div>

                        <form
                            className="mt-4 flex max-h-[26rem] flex-col gap-4 overflow-y-auto pr-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                trackingForm.post(
                                    `/admin/shipments/${shipment.uuid}/trackings`,
                                    {
                                        preserveScroll: true,
                                        onSuccess: () =>
                                            trackingForm.reset(
                                                'tracking_number',
                                                'notes',
                                            ),
                                    },
                                );
                            }}
                        >
                            <Field
                                label={t('shipment.labels.provider')}
                                htmlFor="provider_id"
                                required
                                error={trackingForm.errors.provider_id}
                            >
                                <SearchableSelect
                                    id="provider_id"
                                    value={trackingForm.data.provider_id}
                                    onChange={(providerId) =>
                                        trackingForm.setData(
                                            'provider_id',
                                            providerId,
                                        )
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: t(
                                                'admin.shipments.providerPlaceholder',
                                            ),
                                        },
                                        ...providers.map((provider) => ({
                                            value: provider.id.toString(),
                                            label: provider.name,
                                        })),
                                    ]}
                                    invalid={Boolean(
                                        trackingForm.errors.provider_id,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t(
                                    'shipment.labels.provider_tracking_number',
                                )}
                                htmlFor="tracking_number_new"
                                required
                                error={trackingForm.errors.tracking_number}
                            >
                                <Input
                                    id="tracking_number_new"
                                    value={trackingForm.data.tracking_number}
                                    onChange={(event) =>
                                        trackingForm.setData(
                                            'tracking_number',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder={t(
                                        'admin.shipments.trackingPlaceholder',
                                    )}
                                    className="font-mono"
                                />
                            </Field>
                            <label className="flex items-center justify-between gap-3 text-sm text-foreground">
                                {t('shipment.labels.is_primary')}
                                <input
                                    type="checkbox"
                                    checked={trackingForm.data.is_primary}
                                    onChange={(event) =>
                                        trackingForm.setData(
                                            'is_primary',
                                            event.target.checked,
                                        )
                                    }
                                    className="size-4 rounded border-border text-brand focus:ring-brand"
                                />
                            </label>
                            <Button
                                type="submit"
                                variant="secondary"
                                isLoading={trackingForm.processing}
                                className="w-full"
                            >
                                <PlusIcon className="size-4" />
                                {t('admin.actions.add')}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>

            <Card className="mt-5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="font-display text-2xl text-foreground">
                            {t('admin.shipments.timeline')}
                        </h2>
                        <p className="mt-1 text-xs text-foreground-subtle">
                            {t('admin.shipments.lastUpdate')}:{' '}
                            {shipment.last_status_at
                                ? formatDateTime(shipment.last_status_at)
                                : '-'}
                        </p>
                    </div>
                    <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground-muted">
                        {t('admin.shipments.eventCount', {
                            count: shipment.events.length,
                        })}
                    </span>
                </div>

                <div className="mt-4">
                    <ShipmentTimeline
                        events={shipment.events}
                        emptyLabel={t('admin.shipments.noEvents')}
                        onDelete={setPendingEvent}
                    />
                </div>
            </Card>

            <ConfirmDialog
                open={pendingTracking !== null}
                onClose={() => setPendingTracking(null)}
                onConfirm={removeTracking}
                title={t('admin.actions.delete')}
                description={t('admin.shipments.confirmDeleteTracking')}
                confirmLabel={t('admin.actions.confirm')}
                cancelLabel={t('admin.actions.cancel')}
                destructive
                processing={processing}
            />

            <ConfirmDialog
                open={pendingEvent !== null}
                onClose={() => setPendingEvent(null)}
                onConfirm={removeEvent}
                title={t('admin.shipments.deleteEvent')}
                description={t('admin.shipments.confirmDeleteEvent')}
                confirmLabel={t('admin.actions.confirm')}
                cancelLabel={t('admin.actions.cancel')}
                destructive
                processing={processing}
            />
        </>
    );
}

function ShipmentRealtime({ uuid }: { uuid: string }) {
    useEcho(
        `shipments.${uuid}`,
        '.ShipmentStatusUpdated',
        () => {
            router.reload({ only: ['shipment'] });
        },
        [uuid],
    );

    return null;
}

function Info({
    icon: Icon,
    label,
    value,
}: {
    icon: (props: { className?: string }) => ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-foreground-subtle" />
            <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-foreground-subtle uppercase">
                    {label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                    {value}
                </p>
            </div>
        </div>
    );
}
