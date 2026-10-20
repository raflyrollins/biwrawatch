import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n';
import type { ProviderOption, ShipmentDetail } from '@/types/models';

type FormData = {
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    destination_city: string;
    destination_country: string;
    estimated_delivery_at: string;
    internal_notes: string;
    provider_id: string;
    tracking_number: string;
    status: string;
};

export default function ShipmentForm({
    shipment,
    providers,
    statuses,
}: {
    shipment: ShipmentDetail | null;
    providers: ProviderOption[];
    statuses: Record<string, string>;
}) {
    const { t } = useTranslation();
    const isEditing = shipment !== null;

    const form = useForm<FormData>({
        recipient_name: shipment?.recipient_name ?? '',
        recipient_phone: shipment?.recipient_phone ?? '',
        recipient_address: shipment?.recipient_address ?? '',
        destination_city: shipment?.destination_city ?? '',
        destination_country: shipment?.destination_country ?? 'Indonesia',
        estimated_delivery_at:
            shipment?.estimated_delivery_at?.slice(0, 10) ?? '',
        internal_notes: shipment?.internal_notes ?? '',
        provider_id: '',
        tracking_number: '',
        status: 'pending',
    });

    const submit = () => {
        if (isEditing) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/shipments/${shipment.uuid}`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin/shipments', { preserveScroll: true });
    };

    return (
        <>
            <Head
                title={
                    isEditing
                        ? t('admin.shipments.editTitle')
                        : t('admin.shipments.createTitle')
                }
            />

            <div className="flex items-center gap-3">
                <Link
                    href={
                        isEditing
                            ? `/admin/shipments/${shipment.uuid}`
                            : '/admin/shipments'
                    }
                    className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    aria-label={t('admin.actions.back')}
                >
                    <ChevronLeftIcon className="size-4" />
                </Link>
                <div>
                    <h1 className="font-display text-3xl text-foreground">
                        {isEditing
                            ? t('admin.shipments.editTitle')
                            : t('admin.shipments.createTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-foreground-muted">
                        {isEditing
                            ? shipment.tracking_number
                            : t('admin.shipments.subtitle')}
                    </p>
                </div>
            </div>

            <form
                className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('admin.shipments.recipientInfo')}
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field
                                label={t('shipment.labels.recipient_name')}
                                htmlFor="recipient_name"
                                required
                                error={form.errors.recipient_name}
                            >
                                <Input
                                    id="recipient_name"
                                    value={form.data.recipient_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'recipient_name',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.recipient_name,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t('shipment.labels.recipient_phone')}
                                htmlFor="recipient_phone"
                                required
                                error={form.errors.recipient_phone}
                                hint="Format Indonesia atau internasional."
                            >
                                <Input
                                    id="recipient_phone"
                                    type="tel"
                                    value={form.data.recipient_phone}
                                    onChange={(event) =>
                                        form.setData(
                                            'recipient_phone',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.recipient_phone,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t('shipment.labels.destination_city')}
                                htmlFor="destination_city"
                                required
                                error={form.errors.destination_city}
                            >
                                <Input
                                    id="destination_city"
                                    value={form.data.destination_city}
                                    onChange={(event) =>
                                        form.setData(
                                            'destination_city',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.destination_city,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t('shipment.labels.destination_country')}
                                htmlFor="destination_country"
                                required
                                error={form.errors.destination_country}
                            >
                                <Input
                                    id="destination_country"
                                    value={form.data.destination_country}
                                    onChange={(event) =>
                                        form.setData(
                                            'destination_country',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.destination_country,
                                    )}
                                />
                            </Field>
                        </div>
                        <div className="mt-4">
                            <Field
                                label={t('shipment.labels.recipient_address')}
                                htmlFor="recipient_address"
                                required
                                error={form.errors.recipient_address}
                            >
                                <Textarea
                                    id="recipient_address"
                                    value={form.data.recipient_address}
                                    onChange={(event) =>
                                        form.setData(
                                            'recipient_address',
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                    invalid={Boolean(
                                        form.errors.recipient_address,
                                    )}
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('admin.shipments.shipmentInfo')}
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field
                                label={t(
                                    'shipment.labels.estimated_delivery_at',
                                )}
                                htmlFor="estimated_delivery_at"
                                error={form.errors.estimated_delivery_at}
                            >
                                <CalendarWidget
                                    id="estimated_delivery_at"
                                    value={form.data.estimated_delivery_at}
                                    onChange={(value) =>
                                        form.setData(
                                            'estimated_delivery_at',
                                            value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.estimated_delivery_at,
                                    )}
                                />
                            </Field>
                        </div>
                        <div className="mt-4">
                            <Field
                                label={t('shipment.labels.internal_notes')}
                                htmlFor="internal_notes"
                                error={form.errors.internal_notes}
                            >
                                <Textarea
                                    id="internal_notes"
                                    value={form.data.internal_notes}
                                    onChange={(event) =>
                                        form.setData(
                                            'internal_notes',
                                            event.target.value,
                                        )
                                    }
                                    rows={3}
                                />
                            </Field>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-5">
                    {!isEditing ? (
                        <Card className="p-5">
                            <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                                {t('admin.shipments.trackingHistory')}
                            </h2>
                            <div className="mt-4 flex flex-col gap-4">
                                <Field
                                    label={t('shipment.labels.provider')}
                                    htmlFor="provider_id"
                                    required
                                    error={form.errors.provider_id}
                                >
                                    <SearchableSelect
                                        id="provider_id"
                                        value={form.data.provider_id}
                                        onChange={(providerId) =>
                                            form.setData(
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
                                            form.errors.provider_id,
                                        )}
                                    />
                                </Field>
                                <Field
                                    label={t(
                                        'shipment.labels.provider_tracking_number',
                                    )}
                                    htmlFor="tracking_number"
                                    required
                                    error={form.errors.tracking_number}
                                >
                                    <Input
                                        id="tracking_number"
                                        value={form.data.tracking_number}
                                        onChange={(event) =>
                                            form.setData(
                                                'tracking_number',
                                                event.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder={t(
                                            'admin.shipments.trackingPlaceholder',
                                        )}
                                        className="font-mono"
                                        invalid={Boolean(
                                            form.errors.tracking_number,
                                        )}
                                    />
                                </Field>
                                <Field
                                    label={t('shipment.labels.status')}
                                    htmlFor="status"
                                    error={form.errors.status}
                                >
                                    <Select
                                        id="status"
                                        value={form.data.status}
                                        onChange={(event) =>
                                            form.setData(
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
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-5">
                            <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                                {t('admin.shipments.trackingHistory')}
                            </h2>
                            <p className="mt-3 text-sm text-foreground-muted">
                                {t('admin.shipments.trackingHistory')}{' '}
                                {t('admin.shipments.statusHint')}
                            </p>
                            <Link
                                href={`/admin/shipments/${shipment.uuid}`}
                                className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
                            >
                                {t('admin.shipments.detailTitle')}
                            </Link>
                        </Card>
                    )}

                    <Card className="p-5">
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={form.processing}
                            className="w-full"
                        >
                            {t('admin.actions.save')}
                        </Button>
                        <Link
                            href={
                                isEditing
                                    ? `/admin/shipments/${shipment.uuid}`
                                    : '/admin/shipments'
                            }
                            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-control text-sm font-semibold text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                        >
                            {t('admin.actions.cancel')}
                        </Link>
                    </Card>
                </div>
            </form>
        </>
    );
}
