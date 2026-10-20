import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import type { ProviderSummary } from '@/types/models';

type FormData = {
    name: string;
    tracking_url_template: string;
    tracking_number_pattern: string;
    is_active: boolean;
    sort_order: string;
};

export default function ProviderForm({
    provider,
}: {
    provider: ProviderSummary | null;
}) {
    const { t } = useTranslation();
    const isEditing = provider !== null;

    const form = useForm<FormData>({
        name: provider?.name ?? '',
        tracking_url_template: provider?.tracking_url_template ?? '',
        tracking_number_pattern: provider?.tracking_number_pattern ?? '',
        is_active: provider?.is_active ?? true,
        sort_order: provider?.sort_order?.toString() ?? '0',
    });

    const submit = () => {
        if (isEditing) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/providers/${provider.uuid}`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin/providers', { preserveScroll: true });
    };

    return (
        <>
            <Head
                title={
                    isEditing
                        ? t('admin.providers.editTitle')
                        : t('admin.providers.createTitle')
                }
            />

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/providers"
                    className="inline-flex size-9 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    aria-label={t('admin.actions.back')}
                >
                    <ChevronLeftIcon className="size-4" />
                </Link>
                <div>
                    <h1 className="font-display text-3xl text-foreground">
                        {isEditing
                            ? t('admin.providers.editTitle')
                            : t('admin.providers.createTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-foreground-muted">
                        {t('admin.providers.subtitle')}
                    </p>
                </div>
            </div>

            <form
                className="mt-6 grid max-w-3xl gap-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <Card className="p-5">
                    <div className="grid gap-4">
                        <Field
                            label={t('admin.providers.title')}
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
                                placeholder="JNE, J&T, SiCepat..."
                                invalid={Boolean(form.errors.name)}
                            />
                        </Field>

                        <Field
                            label="URL tracking"
                            htmlFor="tracking_url_template"
                            required
                            error={form.errors.tracking_url_template}
                            hint={t('admin.providers.templateHint')}
                        >
                            <Input
                                id="tracking_url_template"
                                value={form.data.tracking_url_template}
                                onChange={(event) =>
                                    form.setData(
                                        'tracking_url_template',
                                        event.target.value,
                                    )
                                }
                                placeholder="https://example.com/track/{tracking_number}"
                                invalid={Boolean(
                                    form.errors.tracking_url_template,
                                )}
                            />
                        </Field>

                        <Field
                            label="Pola nomor tracking"
                            htmlFor="tracking_number_pattern"
                            error={form.errors.tracking_number_pattern}
                            hint={t('admin.providers.patternHint')}
                        >
                            <Input
                                id="tracking_number_pattern"
                                value={form.data.tracking_number_pattern}
                                onChange={(event) =>
                                    form.setData(
                                        'tracking_number_pattern',
                                        event.target.value,
                                    )
                                }
                                placeholder="/^[A-Z]{3}[0-9]{10}$/"
                                className="font-mono"
                                invalid={Boolean(
                                    form.errors.tracking_number_pattern,
                                )}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
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

                        <label className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-foreground">
                            {t('admin.common.active')}
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
                    </div>
                </Card>

                <div className="flex flex-wrap gap-2">
                    <Button type="submit" isLoading={form.processing}>
                        {t('admin.actions.save')}
                    </Button>
                    <Link
                        href="/admin/providers"
                        className="inline-flex h-11 items-center rounded-control px-4 text-sm font-semibold text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    >
                        {t('admin.actions.cancel')}
                    </Link>
                </div>
            </form>
        </>
    );
}
