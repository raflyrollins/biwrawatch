import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { CalendarWidget } from '@/components/ui/calendar-widget';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n';
import type { PromotionForm } from '@/types/models';

type FormData = {
    name: string;
    label: string;
    description: string;
    discount_type: string;
    discount_value: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    applies_to_all: boolean;
    priority: string;
    watch_ids: number[];
};

function dateInput(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const pad = (part: number) => part.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PromotionFormPage({
    promotion,
    watches,
    discountTypes,
}: {
    promotion: PromotionForm | null;
    watches: Array<{ id: number; label: string }>;
    discountTypes: Record<string, string>;
}) {
    const { t } = useTranslation();
    const isEditing = promotion !== null;

    const form = useForm<FormData>({
        name: promotion?.name ?? '',
        label: promotion?.label ?? '',
        description: promotion?.description ?? '',
        discount_type: promotion?.discount_type ?? '',
        discount_value: promotion?.discount_value?.toString() ?? '',
        starts_at: dateInput(promotion?.starts_at ?? null),
        ends_at: dateInput(promotion?.ends_at ?? null),
        is_active: promotion?.is_active ?? true,
        applies_to_all: promotion?.applies_to_all ?? true,
        priority: promotion?.priority?.toString() ?? '0',
        watch_ids: promotion?.watch_ids ?? [],
    });

    const submit = () => {
        if (isEditing) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/promotions/${promotion.uuid}`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin/promotions', { preserveScroll: true });
    };

    return (
        <>
            <Head
                title={
                    isEditing
                        ? t('admin.promotions.editTitle')
                        : t('admin.promotions.createTitle')
                }
            />

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/promotions"
                    className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    aria-label={t('admin.actions.back')}
                >
                    <ChevronLeftIcon className="size-4" />
                </Link>
                <div>
                    <h1 className="font-display text-3xl text-foreground">
                        {isEditing
                            ? t('admin.promotions.editTitle')
                            : t('admin.promotions.createTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-foreground-muted">
                        {t('admin.promotions.subtitle')}
                    </p>
                </div>
            </div>

            <form
                className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label={t('promotion.labels.name')}
                                htmlFor="name"
                                required
                                error={form.errors.name}
                            >
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    invalid={Boolean(form.errors.name)}
                                />
                            </Field>
                            <Field
                                label={t('promotion.labels.label')}
                                htmlFor="label"
                                error={form.errors.label}
                            >
                                <Input
                                    id="label"
                                    value={form.data.label}
                                    onChange={(event) =>
                                        form.setData(
                                            'label',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Hemat 10%"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field
                                label={t('promotion.labels.description')}
                                htmlFor="description"
                                error={form.errors.description}
                            >
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('promotion.labels.discount_type')}
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field
                                label={t('promotion.labels.discount_type')}
                                htmlFor="discount_type"
                                error={form.errors.discount_type}
                            >
                                <Select
                                    id="discount_type"
                                    value={form.data.discount_type}
                                    onChange={(event) =>
                                        form.setData(
                                            'discount_type',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="">
                                        {t('admin.promotions.noDiscount')}
                                    </option>
                                    {Object.entries(discountTypes).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </Select>
                            </Field>
                            <Field
                                label={t('promotion.labels.discount_value')}
                                htmlFor="discount_value"
                                error={form.errors.discount_value}
                                hint={
                                    form.data.discount_type === 'percentage'
                                        ? 'Masukkan persentase 0-100.'
                                        : 'Masukkan nominal dalam Rupiah.'
                                }
                            >
                                <Input
                                    id="discount_value"
                                    type="number"
                                    min={0}
                                    max={
                                        form.data.discount_type === 'percentage'
                                            ? 100
                                            : undefined
                                    }
                                    value={form.data.discount_value}
                                    onChange={(event) =>
                                        form.setData(
                                            'discount_value',
                                            event.target.value,
                                        )
                                    }
                                    disabled={form.data.discount_type === ''}
                                    invalid={Boolean(
                                        form.errors.discount_value,
                                    )}
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('promotion.labels.watches')}
                        </h2>
                        <label className="mt-4 flex items-center justify-between gap-3 text-sm text-foreground">
                            {t('promotion.labels.applies_to_all')}
                            <input
                                type="checkbox"
                                checked={form.data.applies_to_all}
                                onChange={(event) =>
                                    form.setData(
                                        'applies_to_all',
                                        event.target.checked,
                                    )
                                }
                                className="size-4 rounded border-border text-brand focus:ring-brand"
                            />
                        </label>
                        <p className="mt-1 text-xs text-foreground-muted">
                            {t('admin.promotions.appliesAllHint')}
                        </p>

                        {!form.data.applies_to_all ? (
                            <div className="mt-4">
                                <MultiSelect
                                    id="watch_ids"
                                    options={watches.map((watch) => ({
                                        value: watch.id.toString(),
                                        label: watch.label,
                                    }))}
                                    value={form.data.watch_ids.map(String)}
                                    onChange={(watchIds) =>
                                        form.setData(
                                            'watch_ids',
                                            watchIds.map(Number),
                                        )
                                    }
                                    invalid={Boolean(form.errors.watch_ids)}
                                />
                            </div>
                        ) : null}
                    </Card>
                </div>

                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <div className="grid gap-4">
                            <Field
                                label={t('promotion.labels.starts_at')}
                                htmlFor="starts_at"
                                error={form.errors.starts_at}
                            >
                                <CalendarWidget
                                    id="starts_at"
                                    mode="datetime"
                                    value={form.data.starts_at}
                                    onChange={(value) =>
                                        form.setData('starts_at', value)
                                    }
                                    invalid={Boolean(form.errors.starts_at)}
                                />
                            </Field>
                            <Field
                                label={t('promotion.labels.ends_at')}
                                htmlFor="ends_at"
                                error={form.errors.ends_at}
                                hint={t('admin.promotions.dateHint')}
                            >
                                <CalendarWidget
                                    id="ends_at"
                                    mode="datetime"
                                    value={form.data.ends_at}
                                    onChange={(value) =>
                                        form.setData('ends_at', value)
                                    }
                                    invalid={Boolean(form.errors.ends_at)}
                                />
                            </Field>
                            <Field
                                label={t('promotion.labels.priority')}
                                htmlFor="priority"
                                error={form.errors.priority}
                            >
                                <Input
                                    id="priority"
                                    type="number"
                                    min={0}
                                    value={form.data.priority}
                                    onChange={(event) =>
                                        form.setData(
                                            'priority',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <label className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-foreground">
                            {t('promotion.labels.is_active')}
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) =>
                                    form.setData(
                                        'is_active',
                                        event.target.checked,
                                    )
                                }
                                className="size-4 rounded border-border text-brand focus:ring-brand"
                            />
                        </label>
                    </Card>

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
                            href="/admin/promotions"
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
