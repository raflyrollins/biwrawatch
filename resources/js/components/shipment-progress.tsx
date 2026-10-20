import type { ReactNode } from 'react';
import {
    AlertIcon,
    CheckIcon,
    ClockIcon,
    MapPinIcon,
    PackageIcon,
    ShieldCheckIcon,
    TruckIcon,
} from '@/components/icons';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { formatShortDate } from '@/lib/format';
import type { ShipmentDetail, ShipmentEvent } from '@/types/models';
import { cn } from '@/lib/utils';

type ProgressStep = {
    status: string;
    icon: (props: { className?: string }) => ReactNode;
};

const steps: ProgressStep[] = [
    { status: 'pending', icon: ClockIcon },
    { status: 'picked_up', icon: PackageIcon },
    { status: 'in_transit', icon: TruckIcon },
    { status: 'customs', icon: ShieldCheckIcon },
    { status: 'out_for_delivery', icon: MapPinIcon },
    { status: 'delivered', icon: CheckIcon },
];

const specialStatuses = new Set(['exception', 'returned', 'cancelled']);

export function ShipmentProgress({
    shipment,
    className,
}: {
    shipment: ShipmentDetail;
    className?: string;
}) {
    const { t } = useTranslation();
    const statusIndex = steps.findIndex(
        (step) => step.status === shipment.status.value,
    );
    const isSpecial = specialStatuses.has(shipment.status.value);

    const eventIndexes = shipment.events
        .map((event) =>
            steps.findIndex((step) => step.status === event.status.value),
        )
        .filter((index) => index >= 0);
    const activeIndex = isSpecial
        ? Math.max(...eventIndexes, 0)
        : Math.max(statusIndex, 0);

    const eventByStatus = new Map<string, ShipmentEvent>();

    for (const event of shipment.events) {
        if (!eventByStatus.has(event.status.value)) {
            eventByStatus.set(event.status.value, event);
        }
    }

    const progress =
        steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0;

    const stepTime = (step: ProgressStep, index: number): string => {
        const event = eventByStatus.get(step.status);

        if (event) {
            return formatShortDate(event.occurred_at);
        }

        if (index < activeIndex) {
            return t('ui.trackPage.progressCompleted');
        }

        if (index === activeIndex) {
            return t('ui.trackPage.progressNow');
        }

        return '—';
    };

    return (
        <Card className={cn('overflow-hidden p-6', className)}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
                <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
                        {t('ui.trackPage.progressTitle')}
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted">
                        {t('ui.trackPage.progressSubtitle')}
                    </p>

                    <div className="relative mt-6 hidden lg:block">
                        <div className="absolute top-[22px] right-[8.333%] left-[8.333%] h-0.5 bg-border">
                            <div
                                className="h-full bg-brand transition-[width] duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <ol className="relative grid grid-cols-6 gap-2">
                            {steps.map((step, index) => {
                                const complete = index < activeIndex;
                                const current = index === activeIndex;
                                const Icon = step.icon;

                                return (
                                    <li
                                        key={step.status}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <span
                                            className={cn(
                                                'flex size-11 items-center justify-center rounded-pill border-2 bg-surface transition-colors',
                                                complete &&
                                                    'border-brand bg-brand text-brand-foreground',
                                                current &&
                                                    'border-brand bg-brand-soft text-brand ring-4 ring-brand/10',
                                                !complete &&
                                                    !current &&
                                                    'border-border text-foreground-subtle',
                                            )}
                                        >
                                            {complete ? (
                                                <CheckIcon className="size-4" />
                                            ) : (
                                                <Icon className="size-4" />
                                            )}
                                        </span>
                                        <span
                                            className={cn(
                                                'mt-2 text-[11px] leading-tight font-semibold',
                                                current
                                                    ? 'text-brand'
                                                    : complete
                                                      ? 'text-foreground'
                                                      : 'text-foreground-subtle',
                                            )}
                                        >
                                            {t(
                                                `shipment.status.${step.status}`,
                                            )}
                                        </span>
                                        <span className="mt-0.5 text-[10px] text-foreground-subtle">
                                            {stepTime(step, index)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <ol className="mt-5 flex flex-col lg:hidden">
                        {steps.map((step, index) => {
                            const complete = index < activeIndex;
                            const current = index === activeIndex;
                            const Icon = step.icon;

                            return (
                                <li
                                    key={step.status}
                                    className="relative flex gap-3 pb-5 last:pb-0"
                                >
                                    {index < steps.length - 1 ? (
                                        <span
                                            className={cn(
                                                'absolute top-9 bottom-0 left-[17.5px] w-px',
                                                index < activeIndex
                                                    ? 'bg-brand'
                                                    : 'bg-border',
                                            )}
                                        />
                                    ) : null}
                                    <span
                                        className={cn(
                                            'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-pill border-2 bg-surface',
                                            complete &&
                                                'border-brand bg-brand text-brand-foreground',
                                            current &&
                                                'border-brand bg-brand-soft text-brand ring-4 ring-brand/10',
                                            !complete &&
                                                !current &&
                                                'border-border text-foreground-subtle',
                                        )}
                                    >
                                        {complete ? (
                                            <CheckIcon className="size-3.5" />
                                        ) : (
                                            <Icon className="size-3.5" />
                                        )}
                                    </span>
                                    <div className="min-w-0 pt-0.5">
                                        <p
                                            className={cn(
                                                'text-sm font-semibold',
                                                current
                                                    ? 'text-brand'
                                                    : complete
                                                      ? 'text-foreground'
                                                      : 'text-foreground-subtle',
                                            )}
                                        >
                                            {t(
                                                `shipment.status.${step.status}`,
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-xs text-foreground-subtle">
                                            {stepTime(step, index)}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="hidden justify-center lg:flex">
                    <img
                        src="/images/illustrations/delivery.svg"
                        alt=""
                        className="h-40 w-auto"
                        loading="lazy"
                    />
                </div>
            </div>

            {isSpecial ? (
                <div className="mt-5 flex items-start gap-2.5 rounded-control border border-danger/30 bg-danger/5 p-3 text-xs leading-relaxed text-danger">
                    <AlertIcon className="mt-0.5 size-4 shrink-0" />
                    <p>
                        {t('ui.trackPage.progressIssue', {
                            status: shipment.status.label,
                        })}
                    </p>
                </div>
            ) : null}
        </Card>
    );
}
