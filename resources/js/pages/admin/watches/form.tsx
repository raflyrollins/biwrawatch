import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeftIcon, TrashIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n';
import type { WatchAdmin } from '@/types/models';

type FormData = {
    brand: string;
    model: string;
    reference_number: string;
    year: string;
    movement: string;
    case_material: string;
    case_diameter_mm: string;
    dial_color: string;
    strap_material: string;
    condition: string;
    description: string;
    search_keywords: string;
    price: string;
    status: string;
    is_published: boolean;
    is_featured: boolean;
    sort_order: string;
    images: File[];
};

export default function AdminWatchForm({
    watch,
    conditions,
    statuses,
}: {
    watch: WatchAdmin | null;
    conditions: Record<string, string>;
    statuses: Record<string, string>;
}) {
    const { t } = useTranslation();
    const [imageNames, setImageNames] = useState<string[]>([]);
    const isEditing = watch !== null;

    const form = useForm<FormData>({
        brand: watch?.brand ?? '',
        model: watch?.model ?? '',
        reference_number: watch?.reference_number ?? '',
        year: watch?.year?.toString() ?? '',
        movement: watch?.movement ?? '',
        case_material: watch?.case_material ?? '',
        case_diameter_mm: watch?.case_diameter_mm?.toString() ?? '',
        dial_color: watch?.dial_color ?? '',
        strap_material: watch?.strap_material ?? '',
        condition: watch?.condition.value ?? 'pre_owned',
        description: watch?.description ?? '',
        search_keywords: watch?.search_keywords ?? '',
        price: watch?.price?.toString() ?? '',
        status: watch?.status.value ?? 'available',
        is_published: watch?.is_published ?? true,
        is_featured: watch?.is_featured ?? false,
        sort_order: watch?.sort_order?.toString() ?? '0',
        images: [],
    });

    const submit = () => {
        if (isEditing) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/watches/${watch.uuid}`, {
                forceFormData: true,
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin/watches', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const imageError =
        form.errors['images'] ??
        form.errors['images.0'] ??
        form.errors['images.1'];

    return (
        <>
            <Head
                title={
                    isEditing
                        ? t('admin.watches.editTitle')
                        : t('admin.watches.createTitle')
                }
            />

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/watches"
                    className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    aria-label={t('admin.actions.back')}
                >
                    <ChevronLeftIcon className="size-4" />
                </Link>
                <div>
                    <h1 className="font-display text-3xl text-foreground">
                        {isEditing
                            ? t('admin.watches.editTitle')
                            : t('admin.watches.createTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-foreground-muted">
                        {t('admin.watches.formSubtitle')}
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
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('ui.watchPage.specifications')}
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field
                                label={t('watch.labels.brand')}
                                htmlFor="brand"
                                required
                                error={form.errors.brand}
                            >
                                <Input
                                    id="brand"
                                    value={form.data.brand}
                                    onChange={(event) =>
                                        form.setData(
                                            'brand',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(form.errors.brand)}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.model')}
                                htmlFor="model"
                                required
                                error={form.errors.model}
                            >
                                <Input
                                    id="model"
                                    value={form.data.model}
                                    onChange={(event) =>
                                        form.setData(
                                            'model',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(form.errors.model)}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.reference')}
                                htmlFor="reference_number"
                                required
                                error={form.errors.reference_number}
                            >
                                <Input
                                    id="reference_number"
                                    value={form.data.reference_number}
                                    onChange={(event) =>
                                        form.setData(
                                            'reference_number',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.reference_number,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.year')}
                                htmlFor="year"
                                error={form.errors.year}
                            >
                                <Input
                                    id="year"
                                    type="number"
                                    value={form.data.year}
                                    onChange={(event) =>
                                        form.setData('year', event.target.value)
                                    }
                                    invalid={Boolean(form.errors.year)}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.movement')}
                                htmlFor="movement"
                                error={form.errors.movement}
                            >
                                <Input
                                    id="movement"
                                    value={form.data.movement}
                                    onChange={(event) =>
                                        form.setData(
                                            'movement',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.case_material')}
                                htmlFor="case_material"
                                error={form.errors.case_material}
                            >
                                <Input
                                    id="case_material"
                                    value={form.data.case_material}
                                    onChange={(event) =>
                                        form.setData(
                                            'case_material',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.case_diameter')}
                                htmlFor="case_diameter_mm"
                                error={form.errors.case_diameter_mm}
                            >
                                <Input
                                    id="case_diameter_mm"
                                    type="number"
                                    step="0.1"
                                    value={form.data.case_diameter_mm}
                                    onChange={(event) =>
                                        form.setData(
                                            'case_diameter_mm',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(
                                        form.errors.case_diameter_mm,
                                    )}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.dial_color')}
                                htmlFor="dial_color"
                                error={form.errors.dial_color}
                            >
                                <Input
                                    id="dial_color"
                                    value={form.data.dial_color}
                                    onChange={(event) =>
                                        form.setData(
                                            'dial_color',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.strap_material')}
                                htmlFor="strap_material"
                                error={form.errors.strap_material}
                            >
                                <Input
                                    id="strap_material"
                                    value={form.data.strap_material}
                                    onChange={(event) =>
                                        form.setData(
                                            'strap_material',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.condition')}
                                htmlFor="condition"
                                required
                                error={form.errors.condition}
                            >
                                <Select
                                    id="condition"
                                    value={form.data.condition}
                                    onChange={(event) =>
                                        form.setData(
                                            'condition',
                                            event.target.value,
                                        )
                                    }
                                >
                                    {Object.entries(conditions).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </Select>
                            </Field>
                            <Field
                                label={t('watch.labels.status')}
                                htmlFor="status"
                                required
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
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </Select>
                            </Field>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('watch.labels.description')}
                        </h2>
                        <div className="mt-4 flex flex-col gap-4">
                            <Field
                                label={t('watch.labels.description')}
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
                                    rows={6}
                                />
                            </Field>
                            <Field
                                label={t('watch.labels.search_keywords')}
                                htmlFor="search_keywords"
                                hint="Pisahkan dengan koma. Membantu pencarian internal."
                                error={form.errors.search_keywords}
                            >
                                <Input
                                    id="search_keywords"
                                    value={form.data.search_keywords}
                                    onChange={(event) =>
                                        form.setData(
                                            'search_keywords',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('watch.labels.images')}
                        </h2>

                        {watch && watch.images.length > 0 ? (
                            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                                {watch.images.map((image) => (
                                    <div
                                        key={image.path}
                                        className="group relative overflow-hidden rounded-control border border-border bg-surface-muted"
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="aspect-square size-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.delete(
                                                    `/admin/watches/${watch.uuid}/images/${image.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                            className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-control bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            aria-label={t(
                                                'admin.watches.deleteImage',
                                            )}
                                        >
                                            <TrashIcon className="size-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div className="mt-4">
                            <label
                                htmlFor="images"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted/50 px-4 py-8 text-center transition-colors hover:border-brand/50"
                            >
                                <span className="text-sm font-semibold text-foreground">
                                    {t('watch.labels.images')}
                                </span>
                                <span className="mt-1 text-xs text-foreground-muted">
                                    {t('admin.watches.uploadHint')}
                                </span>
                                <input
                                    id="images"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="sr-only"
                                    onChange={(event) => {
                                        const files = Array.from(
                                            event.target.files ?? [],
                                        );
                                        form.setData('images', files);
                                        setImageNames(
                                            files.map((file) => file.name),
                                        );
                                    }}
                                />
                            </label>
                            {imageNames.length > 0 ? (
                                <ul className="mt-3 flex flex-col gap-1 text-xs text-foreground-muted">
                                    {imageNames.map((name) => (
                                        <li key={name}>{name}</li>
                                    ))}
                                </ul>
                            ) : null}
                            {imageError ? (
                                <p className="mt-2 text-xs text-danger">
                                    {imageError}
                                </p>
                            ) : null}
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-5">
                    <Card className="p-5">
                        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                            {t('watch.labels.price')}
                        </h2>
                        <div className="mt-4">
                            <Field
                                label={t('watch.labels.price')}
                                htmlFor="price"
                                required
                                error={form.errors.price}
                            >
                                <Input
                                    id="price"
                                    type="number"
                                    min={0}
                                    step={100000}
                                    value={form.data.price}
                                    onChange={(event) =>
                                        form.setData(
                                            'price',
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(form.errors.price)}
                                />
                            </Field>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
                            <label className="flex items-center justify-between gap-3 text-sm text-foreground">
                                {t('watch.labels.is_published')}
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_published',
                                            event.target.checked,
                                        )
                                    }
                                    className="size-4 rounded border-border text-brand focus:ring-brand"
                                />
                            </label>
                            <label className="flex items-center justify-between gap-3 text-sm text-foreground">
                                {t('watch.labels.is_featured')}
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_featured',
                                            event.target.checked,
                                        )
                                    }
                                    className="size-4 rounded border-border text-brand focus:ring-brand"
                                />
                            </label>
                            <Field
                                label={t('watch.labels.sort_order')}
                                htmlFor="sort_order"
                                error={form.errors.sort_order}
                            >
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>
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
                            href="/admin/watches"
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
