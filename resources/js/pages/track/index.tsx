import { Head, useForm } from '@inertiajs/react';
import { PackageIcon, ShieldCheckIcon, TruckIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';

export default function TrackIndex({
    tracking_number,
}: {
    tracking_number: string;
}) {
    const { t } = useTranslation();
    const form = useForm({
        tracking_number: tracking_number ?? '',
        phone: '',
    });

    return (
        <>
            <Head title={t('ui.trackPage.title')}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-20">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {t('ui.trackPage.eyebrow')}
                        </p>
                        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
                            {t('ui.trackPage.title')}
                        </h1>
                        <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground-muted">
                            {t('ui.trackPage.subtitle')}
                        </p>

                        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
                            {[
                                {
                                    icon: PackageIcon,
                                    text: t('ui.trackPage.lookupSubtitle'),
                                },
                                {
                                    icon: ShieldCheckIcon,
                                    text: t('ui.trackPage.secureNote'),
                                },
                                {
                                    icon: TruckIcon,
                                    text: t('ui.trackPage.helpText'),
                                },
                            ].map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-start gap-3"
                                >
                                    <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
                                    <p className="text-sm text-foreground-muted">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <img
                            src="/images/illustrations/delivery.svg"
                            alt=""
                            className="mt-10 hidden h-52 w-auto lg:block"
                            loading="lazy"
                        />
                    </div>

                    <Card className="p-6 sm:p-8">
                        <h2 className="font-display text-3xl text-foreground">
                            {t('ui.trackPage.lookupTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-foreground-muted">
                            {t('ui.trackPage.lookupSubtitle')}
                        </p>

                        <form
                            className="mt-6 flex flex-col gap-5"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post('/track/lookup');
                            }}
                        >
                            <Field
                                label={t('ui.trackPage.trackingLabel')}
                                htmlFor="tracking_number"
                                required
                                error={form.errors.tracking_number}
                            >
                                <Input
                                    id="tracking_number"
                                    name="tracking_number"
                                    value={form.data.tracking_number}
                                    onChange={(event) =>
                                        form.setData(
                                            'tracking_number',
                                            event.target.value,
                                        )
                                    }
                                    placeholder={t(
                                        'ui.trackPage.trackingPlaceholder',
                                    )}
                                    autoComplete="off"
                                    invalid={Boolean(
                                        form.errors.tracking_number,
                                    )}
                                />
                            </Field>

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
                                {t('ui.trackPage.submit')}
                            </Button>
                        </form>

                        <p className="mt-4 text-xs leading-relaxed text-foreground-subtle">
                            {t('ui.trackPage.secureNote')}
                        </p>
                    </Card>
                </div>
            </section>
        </>
    );
}
