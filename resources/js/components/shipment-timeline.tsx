import { TrashIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import type { ShipmentEvent } from '@/types/models';

export function ShipmentTimeline({
    events,
    emptyLabel,
    onDelete,
}: {
    events: ShipmentEvent[];
    emptyLabel: string;
    onDelete?: (event: ShipmentEvent) => void;
}) {
    const { t } = useTranslation();

    if (events.length === 0) {
        return <p className="text-sm text-foreground-muted">{emptyLabel}</p>;
    }

    return (
        <ol className="divide-y divide-border overflow-hidden rounded-card border border-border">
            {events.map((event) => (
                <li
                    key={event.id}
                    className="group flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-surface-muted/50"
                >
                    <div className="flex min-w-0 gap-3">
                        <span className="mt-1.5 size-2.5 shrink-0 rounded-pill bg-brand ring-4 ring-brand-soft" />
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                    {event.status.label}
                                </p>
                                {event.is_public === false ? (
                                    <Badge
                                        variant="outline"
                                        className="h-5 px-2 text-[10px]"
                                    >
                                        {t('shipment.labels.internal')}
                                    </Badge>
                                ) : null}
                            </div>
                            <p className="mt-1 text-xs text-foreground-subtle">
                                <time dateTime={event.occurred_at}>
                                    {formatDateTime(event.occurred_at)}
                                </time>
                                {event.location ? (
                                    <span>{` · ${event.location}`}</span>
                                ) : null}
                                {event.creator ? (
                                    <span>{` · ${event.creator}`}</span>
                                ) : null}
                            </p>
                            {event.note ? (
                                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                                    {event.note}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    {onDelete ? (
                        <button
                            type="button"
                            onClick={() => onDelete(event)}
                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-foreground-subtle opacity-100 transition-opacity hover:bg-danger-soft hover:text-danger focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label={t('admin.shipments.deleteEvent')}
                        >
                            <TrashIcon className="size-3.5" />
                        </button>
                    ) : null}
                </li>
            ))}
        </ol>
    );
}
