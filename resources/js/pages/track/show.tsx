import type { ReactNode } from 'react';
import {
    Head,
    router,
    useForm,
    usePage,
    usePoll,
    WhenMounted,
} from '@inertiajs/react';
import { useConnectionStatus, useEcho } from '@laravel/echo-react';
import {
    ClockIcon,
    ExternalLinkIcon,
    MapPinIcon,
    PackageIcon,
    RefreshIcon,
    TruckIcon,
    UserIcon,
} from '@/components/icons';
import { ShipmentProgress } from '@/components/shipment-progress';
import { ShipmentTimeline } from '@/components/shipment-timeline';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { formatDate, formatDateTime } from '@/lib/format';
import type { ShipmentDetail } from '@/types/models';

type Site = {
    whatsapp_url: string | null;
    tracking_refresh_seconds?: number;
};

type Props = {
    tracking_number: string;
    verified: boolean;
    shipment: ShipmentDetail | null;
};

export default function TrackShow({
    tracking_number,
    verified,
    shipment,
}: Props) {
    const { t } = useTranslation();
    const page = usePage();
    const site = page.props.site as Site | undefined;
    const form = useForm({ phone: '' });
    const refreshSeconds = site?.tracking_refresh_seconds ?? 15;
    const terminalStatus = ['delivered', 'returned', 'cancelled'].includes(
        shipment?.status.value ?? '',
    );

    const refreshShipment = () => {
        router.reload({
            only: ['shipment'],
            showProgress: false,
        });
    };

    return (
        <>
            <Head title={`${t('ui.trackPage.title')} · ${tracking_number}`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <section className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-16">
                <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {t('ui.trackPage.eyebrow')}
                        </p>
                        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
                            {tracking_number}
                        </h1>
                        <p className="mt-2 text-sm text-foreground-muted">
                            {t('ui.trackPage.subtitle')}
                        </p>
                    </div>
                    {shipment ? (
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <StatusBadge status={shipment.status.value} />
                            <div className="flex items-center gap-2 text-[11px] text-foreground-subtle">
                                <WhenMounted
                                    fallback={
                                        <TrackingIndicator
                                            isLive={false}
                                            seconds={refreshSeconds}
                                        />
                                    }
                                >
                                    <TrackingConnection
                                        shipmentUuid={shipment.uuid}
                                        refreshSeconds={refreshSeconds}
                                        terminalStatus={terminalStatus}
                                    />
                                </WhenMounted>
                                <button
                                    type="button"
                                    onClick={refreshShipment}
                                    aria-label={t('ui.trackPage.refresh')}
                                    title={t('ui.trackPage.refresh')}
                                    className="inline-flex size-6 items-center justify-center rounded-pill text-foreground-subtle hover:bg-surface-muted hover:text-brand"
                                >
                                    <RefreshIcon className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {!verified || !shipment ? (
                    <Card className="mx-auto mt-10 max-w-xl p-6 sm:p-8">
                        <img
                            src="/images/illustrations/secure-data.svg"
                            alt=""
                            className="mx-auto h-40 w-auto"
                            loading="lazy"
                        />
                        <h2 className="mt-5 font-display text-3xl text-foreground">
                            {t('ui.trackPage.verificationTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {t('ui.trackPage.verificationText')}
                        </p>

                        <form
                            className="mt-6 flex flex-col gap-5"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post(`/track/${tracking_number}/verify`);
                            }}
                        >
                            <Field
                                label={t('ui.trackPage.phoneLabel')}
                                htmlFor="phone"
                                required
                                error={form.errors.phone}
                            >
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.data.phone}
                                    onChange={(event) =>
                                        form.setData(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                    placeholder={t(
                                        'ui.trackPage.phonePlaceholder',
                                    )}
                                    autoComplete="tel"
                                    invalid={Boolean(form.errors.phone)}
                                />
                            </Field>

                            <Button
                                type="submit"
                                size="lg"
                                isLoading={form.processing}
                                className="w-full"
                            >
                                <PackageIcon className="size-4" />
                                {t('ui.trackPage.verifySubmit')}
                            </Button>
                        </form>

                        <p className="mt-4 text-xs leading-relaxed text-foreground-subtle">
                            {t('ui.trackPage.secureNote')}
                        </p>
                    </Card>
                ) : (
                    <div className="mt-10 flex flex-col gap-6">
                        <ShipmentProgress shipment={shipment} />

                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="flex flex-col gap-6">
                                <Card className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold tracking-[0.18em] text-foreground-subtle uppercase">
                                                {t('ui.trackPage.status')}
                                            </p>
                                            <p className="mt-2 font-display text-3xl text-foreground">
                                                {shipment.status.label}
                                            </p>
                                        </div>
                                        <StatusBadge
                                            status={shipment.status.value}
                                        />
                                    </div>

                                    <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                                        <Info
                                            icon={UserIcon}
                                            label={t('ui.trackPage.recipient')}
                                            value={shipment.recipient_name}
                                        />
                                        <Info
                                            icon={MapPinIcon}
                                            label={t(
                                                'ui.trackPage.destination',
                                            )}
                                            value={`${shipment.destination_city}, ${shipment.destination_country}`}
                                        />
                                        <Info
                                            icon={ClockIcon}
                                            label={t('ui.trackPage.estimated')}
                                            value={
                                                shipment.estimated_delivery_at
                                                    ? formatDate(
                                                          shipment.estimated_delivery_at,
                                                      )
                                                    : '-'
                                            }
                                        />
                                        <Info
                                            icon={PackageIcon}
                                            label={t('ui.trackPage.lastUpdate')}
                                            value={
                                                shipment.last_status_at
                                                    ? formatDateTime(
                                                          shipment.last_status_at,
                                                      )
                                                    : '-'
                                            }
                                        />
                                    </div>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <Card className="p-6">
                                    <h2 className="font-display text-2xl text-foreground">
                                        {t('ui.trackPage.courierTracking')}
                                    </h2>
                                    <div className="mt-4 flex flex-col gap-3">
                                        {shipment.trackings.map((tracking) => (
                                            <div
                                                key={tracking.id}
                                                className="rounded-card border border-border p-4"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {tracking.provider_name}
                                                    </p>
                                                    {tracking.is_primary ? (
                                                        <span className="text-[10px] font-semibold tracking-wide text-brand uppercase">
                                                            {t(
                                                                'ui.trackPage.primary',
                                                            )}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="mt-1 font-mono text-sm text-foreground-muted">
                                                    {tracking.tracking_number}
                                                </p>
                                                {tracking.tracking_url ? (
                                                    <a
                                                        href={
                                                            tracking.tracking_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand underline-offset-4 hover:underline"
                                                    >
                                                        {t(
                                                            'ui.trackPage.openCourier',
                                                        )}
                                                        <ExternalLinkIcon className="size-3.5" />
                                                    </a>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <TruckIcon className="size-5 text-brand" />
                                    <h2 className="mt-3 font-display text-2xl text-foreground">
                                        {t('ui.trackPage.help')}
                                    </h2>
                                    <p className="mt-2 text-sm text-foreground-muted">
                                        {t('ui.trackPage.helpText')}
                                    </p>
                                    {site?.whatsapp_url ? (
                                        <a
                                            href={site.whatsapp_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                                        >
                                            {t('ui.common.contactWhatsapp')}
                                        </a>
                                    ) : null}
                                </Card>
                            </div>
                        </div>

                        <Card className="p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-display text-2xl text-foreground">
                                        {t('ui.trackPage.timeline')}
                                    </h2>
                                    <p className="mt-1 text-xs text-foreground-subtle">
                                        {t('ui.trackPage.lastUpdate')}:{' '}
                                        {shipment.last_status_at
                                            ? formatDateTime(
                                                  shipment.last_status_at,
                                              )
                                            : '-'}
                                    </p>
                                </div>
                                <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground-muted">
                                    {t('ui.trackPage.updateCount', {
                                        count: shipment.events.length,
                                    })}
                                </span>
                            </div>

                            <div className="mt-4">
                                <ShipmentTimeline
                                    events={shipment.events}
                                    emptyLabel={t('ui.trackPage.timelineEmpty')}
                                />
                            </div>
                        </Card>
                    </div>
                )}
            </section>
        </>
    );
}

function TrackingConnection({
    shipmentUuid,
    refreshSeconds,
    terminalStatus,
}: {
    shipmentUuid: string;
    refreshSeconds: number;
    terminalStatus: boolean;
}) {
    const connectionStatus = useConnectionStatus();
    const isLive = connectionStatus === 'connected';

    const refreshShipment = () => {
        router.reload({
            only: ['shipment'],
            showProgress: false,
        });
    };

    useEcho(
        `tracking.${shipmentUuid}`,
        '.ShipmentStatusUpdated',
        refreshShipment,
        [shipmentUuid],
        'public',
    );

    usePoll(
        refreshSeconds * 1000,
        {
            only: ['shipment'],
            showProgress: false,
        },
        {
            background: 'pause',
            autoStart: !terminalStatus,
        },
    );

    return <TrackingIndicator isLive={isLive} seconds={refreshSeconds} />;
}

function TrackingIndicator({
    isLive,
    seconds,
}: {
    isLive: boolean;
    seconds: number;
}) {
    const { t } = useTranslation();

    return (
        <>
            <span
                className={`size-1.5 rounded-pill ${isLive ? 'animate-pulse bg-success' : 'bg-warning'}`}
            />
            <span>
                {isLive
                    ? t('ui.trackPage.live')
                    : t('ui.trackPage.autoRefresh', { seconds })}
            </span>
        </>
    );
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
